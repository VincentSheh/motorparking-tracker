import numpy as np
import socket
import json
import cv2
from flask import Flask, request, jsonify
from ultralytics import YOLO
from update_db import create_or_get_parking, get_polygons
# Initialize Flask app
app = Flask(__name__)

# Load YOLO model
def load_model():
    return YOLO('yolov8l.pt')

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
    create_or_get_parking(uuid, latitude, longitude, curr_motor)

def get_parkinglot_polygons(display_id):
    polygon_list = get_polygons(display_id)
    return polygon_list


def decode_json(request):
    parking_data_json = request.files['parking_data'].read().decode('utf-8')
    parking_data = json.loads(parking_data_json)
    print(parking_data)
    if 'image' not in request.files:
        return 'No file part'    
    image = request.files['image']
    if image:
        image_bytes = image.read()
        img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    return parking_data, img  

#Crop Image using polygons
def crop_img(img, display_id):
    polygon_points = get_parkinglot_polygons(display_id)
    print(polygon_points)
    if len(polygon_points) == 0: return img
    pts = np.array(polygon_points, np.int64)
    pts = pts.reshape((-1, 1, 2))

    mask = np.zeros_like(img) #Create a black image with similar shape as original

    cv2.fillPoly(mask, [pts], (255, 255, 255)) #Insert the polygon and fill it with white

    result = cv2.bitwise_and(img, mask) #Perform intersection of the masked image and the original

    return result
  
def send_detection_count(n_motor):
    try:#TODO: CHANGE ID TO UUID
        data_dict = {'id': '001', 'currMotor': n_motor}
        json_data = json.dumps(data_dict)
        msg = ' '.join(['update', json_data])
        client_socket.send(msg.encode())
    except Exception as e:
        print(f"Error sending data: {e}")
        
@app.route("/")
@app.route("/hello")
def hello_world():
    print("Received Hello from client")
    return "Hi there, detector server running on port 3001\n"

@app.route("/detect", methods=['POST'])
def detect_image():
    parking_data, img = decode_json(request)
    img = crop_img(img, parking_data['uuid'])
    cv2.imwrite('rec_img.jpg', img)  # Consider a more dynamic file naming
    result = model.predict(img, classes=3, verbose=False)
    n_motor = len(result[0].boxes.xyxy)
    print("Number of Motorcycle is ", n_motor)
    insert_parkinglot(parking_data, n_motor)

    send_detection_count(n_motor)
    return jsonify({"message": "Inference started"})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
