from peewee import Model, PostgresqlDatabase, CharField, UUIDField, IntegerField, SQL
import uuid
import ast
from peewee import DoesNotExist
from datetime import datetime
import pyrebase
from typing import Union
import cv2
from playhouse.db_url import connect

firebaseConfig = {
  "apiKey": "AIzaSyBaAPC0iP8TzIfmYPeWe0FG2K57eAcRrSQ",
  "authDomain": "motorparking-tracker-80865.firebaseapp.com",
  "databaseURL": "https://motorparking-tracker-80865-default-rtdb.asia-southeast1.firebasedatabase.app",
  "projectId": "motorparking-tracker-80865",
  "storageBucket": "motorparking-tracker-80865.appspot.com",
  "messagingSenderId": "47412662760",
  "appId": "1:47412662760:web:ac902b6dcbc075dd58d45d",
  "measurementId": "G-FR9C69RRE2",
  "serviceAccount": "motorparking-tracker-80865-firebase-adminsdk-xm7m2-e6b9d65206.json"
  
}


# db = PostgresqlDatabase('parking-tracker', user='postgres', password='postgres', host='localhost', port=5432)
# db = PostgresqlDatabase('motorparking', 
#                         user='sheh.v123', 
#                         password='sBVKiN3FY2OT', 
#                         host='ep-nameless-surf-69829213-pooler.us-east-2.aws.neon.tech', 
#                         endpointid='ep-nameless-surf-69829213-pooler'
                        # sslmode='require')
db = connect("postgresql://sheh.v123:sBVKiN3FY2OT@ep-nameless-surf-69829213-pooler.us-east-2.aws.neon.tech/motorparking?sslmode=require&options=endpoint%3Dep-nameless-surf-69829213-pooler")

class Parkings(Model):
    id = IntegerField(primary_key=True)  # Serial in PostgreSQL is typically represented as an IntegerField in Peewee
    display_id = CharField(default=uuid.uuid4, unique=True, index=True, null=False)
    latitude = CharField(max_length=100)
    longitude = CharField(max_length=100)
    polygon_axes = CharField(max_length = 100)
    curr_motor = IntegerField(default=0)
    max_space = IntegerField(default=0)

    class Meta:
        database = db
        table_name = 'parkings'
    def __str__(self):
        return f"Parking(\nid={self.id}, \ndisplay_id={self.display_id}, \nlatitude={self.latitude}, \nlongitude={self.longitude}, \ncurr_motor={self.curr_motor}, \nmax_space={self.max_space})"
      
db.connect()

def create_or_get_parking(display_id: str, latitude: str = None, longitude: str = None, curr_motor: int = 0, max_space: int = 0):
    defaults = dict()
    if max_space==0: #Create Parking
      defaults = {'display_id':display_id, 'latitude': latitude, 'longitude': longitude, 'curr_motor':curr_motor}
      print("Created: ", defaults)
      
    else: #Update Parking
      defaults = {'curr_motor': curr_motor}
    parking, created = Parkings.get_or_create(
      display_id=display_id,
      defaults=defaults)
    return parking
  
def get_polygons(display_id: uuid.UUID):
  try:
    parking = Parkings.get(Parkings.display_id == display_id)
    str_polygon_axes = parking.polygon_axes
    if str_polygon_axes != None:
      polygons_axes = ast.literal_eval(parking.polygon_axes)
      return polygons_axes, True
    return [],True
  except DoesNotExist:
    return [],False
  
def upload_firebase(folder_name:Union[uuid.UUID, str], img):
  firebase = pyrebase.initialize_app(firebaseConfig)
  storage = firebase.storage()
  cv2.imwrite("test.jpg", img)
  current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
  success, encoded_img = cv2.imencode('.jpg', img)
  # image_data = encoded_img.tobytes()

  firebase_path = f"{folder_name}/{current_time}.jpg"
  storage.child(firebase_path).put(encoded_img, content_type="image/jpeg")  