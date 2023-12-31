import requests
import json
import cv2
import numpy as np
# import picamera
import time
from PIL import Image
import uuid
import os 
import random
import threading

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
  def __init__(self, id, location):
    self.state = 'Registering'
    #TODO: CHANGE UUID
    self.uuid = id
    # self.uuid = str(uuid.uuid4()) 
    # self.uuid = str(get_rpi_uuid())
    # TODO: GET GPS MODULE
    latitude, longitude = location
    # self.model_addr = "http://140.112.18.202:3001/detect"
    self.model_addr = "http://127.0.0.1:3001/detect"

    self.axes = {'latitude':latitude, 'longitude':longitude}
    self.curr_motor = 0
    self.image_list = os.listdir(f"./parking_images/{self.uuid}")
    

  #Capture the image and perform preprocessing such as cropping
  def rpi_capture_img(self):
    with picamera.PiCamera() as camera:
        camera.resolution = (640, 480) #TODO: Replace Resolution
        camera.framerate = 24
        image = np.empty((480 * 320 * 3,), dtype=np.uint8)
        camera.capture(image, 'bgr')
        img = image.reshape((480, 640, 3))
    return img
        
  def test_capture_img(self, img_path='1.jpeg'):
    file_path = f'./parking_images/{self.uuid}/'
    img_path = random.choice(self.image_list)
    path = f'{file_path}{img_path}'
    img = cv2.imread(path) 
    return img
      

  def post_img(self, img):
    api = self.model_addr
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
    self.curr_state = 'Registering'
    time.sleep(random.randint(1,5))
    while True:
      print("Execution started for RPi: ",self.uuid)

      img = self.test_capture_img()
      self.post_img(img)
      time.sleep(30)


def run_rpi_client(id, loc):
    rpi = RPi_client(id, loc)
    rpi.run()
    
if __name__ == '__main__':
  #Simulate an RPi
  locations = [
                (25.042021191006476, 121.5234109484254), #男四
                (25.015017036477715, 121.53051299327274), #水源
                (25.013874166656965, 121.54123517602629), #台科大
                (25.026584635747103, 121.52723633223454), #師大
                (25.04194159732383, 121.50789932362468), #西門
                ]  
  uuid_list = [
          "52c5f4c9-332c-4e11-8dcc-4b9b6a56224d",
          "59189b6c-54bf-4471-868b-a8aae1f3bb41",
          "3686144c-9698-4113-8d55-eefe726287e2",
          "72885325-dd5d-4024-821c-fabc064d754e",
          "d8e91f04-ff79-4a6b-bf30-bd209086cc3e",
          ]
  parking_dir = []
  threads = []
  for i in range(5):
    thread = threading.Thread(target=run_rpi_client, args=(uuid_list[i], locations[i]))
    threads.append(thread)
    thread.start()
