from peewee import Model, PostgresqlDatabase, CharField, UUIDField, IntegerField, SQL
import uuid
import ast
db = PostgresqlDatabase('parking-tracker', user='postgres', password='postgres', host='localhost', port=5432)

class Parkings(Model):
    id = IntegerField(primary_key=True)  # Serial in PostgreSQL is typically represented as an IntegerField in Peewee
    display_id = UUIDField(default=uuid.uuid4, unique=True, index=True, null=False)
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

def create_or_get_parking(display_id: uuid.UUID, latitude: str = None, longitude: str = None, curr_motor: int = 0, max_space: int = 0):
    defaults = dict()
    if longitude != None or longitude != None: #Create Parking
      defaults = {'display_id':display_id, 'latitude': latitude, 'longitude': longitude, 'curr_motor':curr_motor}
    else: #Update Parking
      defaults = {'curr_motor': curr_motor}
    parking, created = Parkings.get_or_create(
      display_id=display_id,
      defaults=defaults)
    return parking
  
def get_polygons(display_id: uuid.UUID):
    parking = Parkings.get(Parkings.display_id == display_id)
    str_polygon_axes = parking.polygon_axes
    if str_polygon_axes != None:
      polygons_axes = ast.literal_eval(parking.polygon_axes)
      return polygons_axes
    return []