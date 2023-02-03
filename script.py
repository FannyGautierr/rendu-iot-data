import network
import urequests
import utime
import ujson
import random
from machine import Pin, ADC

zoomPin = ADC(Pin(28))
xAxis = ADC(Pin(27))
yAxis = ADC(Pin(26))
button = Pin(0, Pin.IN, Pin.PULL_UP)

lettersAndNumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
controllerId = ''.join(random.choice(lettersAndNumbers) for i in range(10))

wlan = network.WLAN(network.STA_IF)
wlan.active(True)

ssid = 'YOUR_SSID'
password = 'YOUR_PASSWORD'
wlan.connect(ssid, password)
url = "http://YOUR_SERVER_IP_ADDRESS:3000/api/control"


while True:
    print(button.value())
    try:
        x = round((xAxis.read_u16() / 65535 - 0.5) * 2, 3)
        y = round((yAxis.read_u16() / 65535 - 0.5) * 2, 3)
        zoom = round(zoomPin.read_u16() / 65535, 1)

        print('POST')
        r = urequests.post(url, headers={'Content-type': 'application/json'}, json={
            'controllerId': controllerId,
            'x': x,
            'y': y,
            'zoom': zoom  
        })
        print(r.json())
        r.close()
    except Exception as e:
        print(e)
