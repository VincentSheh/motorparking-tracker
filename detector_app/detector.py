import numpy as np
import socket
import json
import cv2
from flask import Flask, request, jsonify
from ultralytics import YOLO
from update_db import create_or_update_parking, get_polygons, upload_firebase
# Initialize Flask app
app = Flask(__name__)

# Load YOLO model
def load_model():
    return YOLO('yolov8x.pt')

model = load_model()

# Set up socket connection
def create_socket_connection():
    server_host = '127.0.0.1'
    server_port = 6000
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((server_host, server_port))
    return client_socket

client_socket = create_socket_connection()

#Insert a new parking location to the database
def insert_parkinglot(parking_data, n_motor):
    uuid = parking_data['uuid']
    latitude = float(parking_data['latitude'])
    longitude = float(parking_data['longitude'])
    # curr_motor = int(parking_data['curr_motor'])
    curr_motor = n_motor
    create_or_update_parking(uuid, latitude, longitude, curr_motor)

def get_parkinglot_polygons_and_is_exist(display_id):
    polygon_list, exist = get_polygons(display_id)
    return polygon_list, exist


def decode_json(request):
    parking_data_json = request.files['parking_data'].read().decode('utf-8')
    parking_data = json.loads(parking_data_json)
    if 'image' not in request.files:
        return 'No file part'    
    image = request.files['image']
    if image:
        image_bytes = image.read()
        cv2_img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    return parking_data, cv2_img  

#Mask the Image using polygons
def crop_img(img, polygon_points):
    orig_img = img.copy()
    if len(polygon_points) == 0: return img, np.zeros_like(img)
    pts = np.array(polygon_points, np.int64)
    pts = pts.reshape((-1, 1, 2))

    # mask = np.zeros_like(img) #Create a black image with similar shape as original

    # cv2.fillPoly(mask, [pts], (255, 255, 255)) #Insert the polygon and fill it with white

    # result = cv2.bitwise_and(img, mask) #Perform intersection of the masked image and the original
    illegal_parking = cv2.fillPoly(img, [pts], (0,255,0)) #Fill Polygon with Green
    return orig_img, illegal_parking
  
def send_detection_count(parking_data, n_motor, exist):
    try:#TODO: CHANGE ID TO UUID
        # if not exist:
        if True:
            data_dict = {'id': parking_data['uuid'],
                         'latitude': parking_data['latitude'],
                         'longitude': parking_data['longitude'],
                         'currMotor': n_motor} 
            socket_action = 'update'
        else:
            data_dict = {'id': parking_data['uuid'], 'currMotor': n_motor}
            socket_action = 'update'
        print(data_dict['id'], socket_action)
        json_data = json.dumps(data_dict)
        msg = ' '.join([socket_action, json_data])
        client_socket.send(msg.encode())
    except Exception as e:
        print(f"ERROR! sending data: {e}")
        
def upload_to_cloud(parking_data, image, n_ill_motor, ill_result):
    upload_firebase(parking_data['uuid'], image)
    if n_ill_motor >0:
        boxed_img = image.copy()
        ill_result = ill_result[0]
        for detection in ill_result.boxes.xyxy:
            # Extract bounding box coordinates
            x1, y1, x2, y2 = detection
            start_point = (int(x1), int(y1))
            end_point = (int(x2), int(y2))

            # Custom color (e.g., red in BGR)
            color = (0, 0, 255)  # BGR format

            # Draw the rectangle
            boxed_img = cv2.rectangle(boxed_img, start_point, end_point, color, 2)            
        upload_firebase("Illegal Parkings", boxed_img)  
        
@app.route("/")
@app.route("/hello")
def hello_world():
    print("Received Hello from client")
    return "Hi there, detector server running on port 3001\n"

@app.route("/detect", methods=['POST'])
def detect_image():
    parking_data, cv2_img = decode_json(request)
    polygon_points, exist = get_parkinglot_polygons_and_is_exist(parking_data['uuid'])
    
    park_img, ill_park_img = crop_img(cv2_img, polygon_points)
    cv2.imwrite("park_img.jpg", park_img)
    cv2.imwrite("ill_park_img.jpg", ill_park_img)

    result = model.predict(park_img, classes=3, conf = 0.4, save=True, verbose=False)
    ill_result = model.predict(ill_park_img, classes=3, conf = 0.5, save=False , verbose =False)
    tot_n_motor = len(result[0].boxes.xyxy)
    n_ill_motor = len(ill_result[0].boxes.xyxy)
    n_park_motor = tot_n_motor - n_ill_motor
    if n_park_motor < 0:
        n_park_motor = 0
    print("Number of Parked Motorcycles is ", n_park_motor)
    print("Illegal Parkings: ", n_ill_motor)
    
    #Upload to firebase if detect illegal parking image
    upload_to_cloud(parking_data, park_img, n_ill_motor, ill_result)
    insert_parkinglot(parking_data, n_park_motor)
    send_detection_count(parking_data, n_park_motor, exist)
    return jsonify({"message": "Inference started"})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, threaded=True)
