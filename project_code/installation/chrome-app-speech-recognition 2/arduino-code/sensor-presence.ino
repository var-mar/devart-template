const int buttonPin = 2;     // the number of the pushbutton pin
const int ledPin =  13;      // the number of the LED pin

// variables will change:
int buttonState = 0;         // variable for reading the pushbutton status
int lastButtonState = 0;
void setup() {
  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);      
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);  
  Serial.begin(9600);
}

void loop(){
  // read the state of the pushbutton value:
  lastButtonState = buttonState;
  buttonState = digitalRead(buttonPin);
  if(lastButtonState != buttonState){
    if (buttonState == HIGH) {     
      // turn LED on:    
      digitalWrite(ledPin, HIGH);  
      Serial.println('y');
    }else {
      // turn LED off:
      digitalWrite(ledPin, LOW); 
      Serial.println('n');
    }
  }
}


