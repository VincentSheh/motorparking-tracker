import cv2
import numpy as np

# Load your image
img = cv2.imread('illegal2.png')
polygon_points = [] #TODO: 

def get_points(event, x, y, flags, param):
  if event == cv2.EVENT_LBUTTONDOWN:
    cur_coord = (x,y)
    cv2.circle(img, cur_coord, 5, (0, 0, 255), -1)  # Draw circle
    if len(polygon_points) > 0: cv2.line(img, polygon_points[-1], cur_coord, (255,0,0), 2)
    polygon_points.append((x,y)) 
    
# Create a window and set the mouse callback function
cv2.namedWindow('image')
cv2.setMouseCallback('image', get_points)

while True:
    cv2.imshow('image', img)
    if cv2.waitKey(20) & 0xFF == 27:  # Exit if ESC is pressed
      break

# # Convert points into a format suitable for cv2.fillPoly
print(polygon_points)
pts = np.array(polygon_points, np.int32)
pts = pts.reshape((-1, 1, 2))

# Create a mask with the same dimensions as the image, fill it with zeros (black)
mask = np.zeros_like(img)

# Fill the hexagon in the mask with white color
cv2.fillPoly(mask, [pts], (255, 255, 255))

# Bitwise AND operation to keep only the area within the hexagon
result = cv2.bitwise_and(img, mask)

cv2.imshow('Result Image', result)
cv2.waitKey(0)
cv2.destroyAllWindows()


  
