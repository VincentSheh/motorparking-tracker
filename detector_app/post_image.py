import requests
import json
import cv2
import numpy as np
# import picamera
import time
from PIL import Image
import uuid

def get_rpi_uuid():
    cpu_serial_path = '/proc/cpuinfo'
    
    try:
        with open(cpu_serial_path, 'r') as f:
            for line in f:
                if line.startswith('Serial'):
                    serial = line.split(':')[1].strip()
                    return serial
    except IOError:
        return "Error: Unable to open the file."
def get_location(): #TODO: CHANGE RPi Location
    response = requests.get('http://ipinfo.io/json')
    data = response.json()

    location = data.get('loc', None)
    
    if location:
        latitude, longitude = location.split(',')
        latitude, longitude = 25.03582739518955, 121.51698905293016
        return latitude, longitude


class RPi_client():
  def __init__(self):
    self.state = 'Registering'
    #TODO: CHANGE UUID
    self.uuid = '52c5f4c9-332c-4e11-8dcc-4b9b6a56224d'
    # self.uuid = str(uuid.uuid4()) 
    # self.uuid = str(get_rpi_uuid())
    # TODO: GET GPS MODULE
    latitude, longitude = get_location()

    self.axes = {'latitude':latitude, 'longitude':longitude}
    self.curr_motor = 0
    
  
  # def crop_img(self, img):
  #   polygon_points = [(2289, 657), (2254, 828), (2341, 998), (2491, 1059), (2619, 980), (2615, 660), (2322, 654)] #Replace with points obtained from get_lasso_points.py
  #   polygon_points
  #   pts = np.array(polygon_points, np.int32)
  #   pts = pts.reshape((-1, 1, 2))

  #   mask = np.zeros_like(img) #Create a black image with similar shape as original

  #   cv2.fillPoly(mask, [pts], (255, 255, 255)) #Insert the polygon and fill it with white
    
  #   result = cv2.bitwise_and(img, mask) #Perform intersection of the masked image and the original

  #   return img #TODO: REPLACE WITH RESULT


  #Capture the image and perform preprocessing such as cropping
  def rpi_capture_img(self):
    with picamera.PiCamera() as camera:
        camera.resolution = (640, 480) #TODO: Replace Resolution
        camera.framerate = 24
        image = np.empty((480 * 320 * 3,), dtype=np.uint8)
        camera.capture(image, 'bgr')
        img = image.reshape((480, 640, 3))
    return img
        
  def test_capture_img(self, path='./sample_image.jpg'):
    img = cv2.imread(path) 
    return img
      

  def post_img(self, img, api = 'http://localhost:3001/detect'):
    
    #Crop the Image
    # img = self.crop_img(img)

    #Convert to jpg format from numpy
    _, encoded_img = cv2.imencode('.jpg', img)
    image_data = encoded_img.tobytes()

    np_arr = np.frombuffer(image_data, np.uint8)
    
    headers = {}
    parking_data = dict()
    if self.state == 'Registering':
      parking_data = {'state': self.state, 'uuid': self.uuid, 'latitude': self.axes['latitude'], 'longitude': self.axes['longitude'], 'curr_motor': self.curr_motor}
    if self.state == 'Connected':
      parking_data = {'state': self.state, 'uuid': self.uuid, 'curr_motor': self.curr_motor}
      
    parking_data_bytes = json.dumps(parking_data).encode('utf-8')
    payload = {"image": image_data ,"parking_data": parking_data_bytes}
    try:
      resp = requests.post(api, files = payload)
      print(resp.status_code, resp.text)
      if resp.status_code == 200:
        self.status = 'Connected'
      if resp.status_code == 503:
        self.status = 'Registering'      
    except requests.exceptions.ConnectionError:
      print("Server is not accessible [503]")
      

  
  def run(self):
    #While True
    self.curr_state = 'Registering'
    img = self.test_capture_img()
    self.post_img(img)

if __name__ == '__main__':
  
  rpi = RPi_client()
  rpi.run()
    
