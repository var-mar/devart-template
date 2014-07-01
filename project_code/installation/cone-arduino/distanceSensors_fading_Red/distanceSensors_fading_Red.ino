/*
Wishing wall cone code
Authors: Varvara Guljajeva and Mar Canet (2014)
This code is part 'Wishing wall' art installation done for DEVART (art made with code) commission by Google
Description:
Get information two presence sensors
*/
//on PCB RedLed is pin 10 and White Pin 9
int distanceSensor = 2;
int distanceSensor2 = 3;
int ledPin =  9;
int ledRed = 10;
int value = 0; 

int microphoneActive = 0;
unsigned long long elapsedOff = 0;
unsigned long long timestampOff = 0;
char isPossibleToActiveMicrophone = '1';
int sensorState;
int lastSensorState;
int i = 0;
// the setup routine runs once when you press reset:
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  // make the pushbutton's pin an input:
  pinMode(distanceSensor, INPUT);
  pinMode(distanceSensor2, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(ledRed, OUTPUT);
}

// the loop routine runs over and over again forever:
void loop() {
  if(Serial.available()>0){
    // send 1 to allow interaction
    // send 2 to put off light not active
    isPossibleToActiveMicrophone = Serial.read();
    if(isPossibleToActiveMicrophone=='2'){
      timestampOff = millis();
    }
  }
  // read the input pin:
  lastSensorState = sensorState;
  int sensorState1 = digitalRead(distanceSensor);
  int sensorState2 = digitalRead(distanceSensor2);
  if(sensorState1==0 || sensorState2==0){
    sensorState = 0; // there is someone
    //Serial.println("y");
  }else{
    sensorState = 1; // there is noone
    //Serial.println("n");
  }

  // to activate
  if(isPossibleToActiveMicrophone=='2'){
    digitalWrite(ledPin, LOW);
    digitalWrite(ledRed, LOW);
  }else if (isPossibleToActiveMicrophone=='1' && microphoneActive == 0 && sensorState==0 ) {
    digitalWrite(ledPin, LOW);
    digitalWrite(ledRed, HIGH);
    microphoneActive = 1;
    Serial.println("1");
  } 
  else if(  microphoneActive == 0 || sensorState==1 ) {
    if(lastSensorState==0) elapsedOff = millis();
    if(microphoneActive==1 && (millis()-elapsedOff)>2000){
      Serial.println("0");
      //digitalWrite(ledRed, LOW);
      microphoneActive = 0;
      i=270;
      isPossibleToActiveMicrophone='2';
    }
    if(microphoneActive == 0){
      pulsating();
    }
  }
}

void pulsating(){
  i++;
  if(i>=360){
    i=0;
  }
  //convert 0-360 angle to radian (needed for sin function)
  float rad = DEG_TO_RAD * i;
  //calculate sin of angle as number between 0 and 255
  int sinOut = constrain((sin(rad) * 128) + 128, 0, 255); 
  analogWrite(ledPin, sinOut);
  delay(12);
}



