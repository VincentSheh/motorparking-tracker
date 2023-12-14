import socket
import json

def is_valid_json(msg):
    try:
        json.loads(msg)
        return True
    except:
        return False

server_host = '127.0.0.1'
server_port = 6000
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((server_host, server_port))
while True:
    json_msg = input('Input the message you want to send : \n')
    if is_valid_json(json_msg):
        command_msg = input('Input the command : \n')
        msg = ' '.join([command_msg, json_msg])
        client_socket.send(msg.encode())
    else:
        if json_msg == 'create_0':
            data_dict = {
                '000':{
                    'position':{
                        'lat':25.01370607644918,
                        'lng':121.53468199176018,
                    },
                    'currMotor': 0,
                    'maxSpace': 10
                }
            }
            json_data = json.dumps(data_dict)
            msg = ' '.join(['create', json_data])
            client_socket.send(msg.encode())
        elif json_msg == 'create_1':
            data_dict = {
                '001':{
                    'position':{
                        'lat':25.019695170584253,
                        'lng':121.53892975940961,
                    },
                    'currMotor': 0,
                    'maxSpace': 10
                }
            }
            json_data = json.dumps(data_dict)
            msg = ' '.join(['create', json_data])
            client_socket.send(msg.encode())
        elif json_msg == 'create_2':
            data_dict = {
                '002':{
                    'position':{
                        'lat':25.01553602325314,
                        'lng':121.53730498100268,
                    },
                    'currMotor': 1,
                    'maxSpace': 10
                }
            }
            json_data = json.dumps(data_dict)
            msg = ' '.join(['create', json_data])
            client_socket.send(msg.encode())
        elif json_msg == 'create_3':
            data_dict = {
                '003':{
                    'position':{
                        'lat':25.01665068859966,
                        'lng':121.5442538922257,
                    },
                    'currMotor': 2,
                    'maxSpace': 10
                }
            }
            json_data = json.dumps(data_dict)
            msg = ' '.join(['create', json_data])
            client_socket.send(msg.encode())
        elif json_msg == 'update_0':
            data_dict = {
                'id':'bc2bdfc4-3ba5-4282-90f1-fa5802defaec',
                'currMotor':10
            }
            json_data = json.dumps(data_dict)
            msg = ' '.join(['update', json_data])
            client_socket.send(msg.encode())
        elif json_msg == 'update_1':
            data_dict = {
                'id':'03c5d93e-bd9d-4814-aa57-a0d46a6ad084',
                'currMotor':5
            }
            json_data = json.dumps(data_dict)
            msg = ' '.join(['update', json_data])
            client_socket.send(msg.encode())
        elif json_msg == 'update_2':
            data_dict = {
                'id':'002',
                'currMotor':10
            }
            json_data = json.dumps(data_dict)
            msg = ' '.join(['update', json_data])
            client_socket.send(msg.encode())
        elif json_msg == 'test':
            msg = ' '.join(['test', json.dumps({"test":"test"})])
            client_socket.send(msg.encode())
        else: print("INVALID INPUT")
            