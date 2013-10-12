
// set pin numbers:
const int buttonUp = 4;         // the number of the pushbutton pin
const int buttonDown =  5;      // the number of the LED pin
const int buttonLeft = 5;       // the number
const int buttonRight = 4;      // the number
const int led = 8;

// variables will change:
int buttonState = 0;         // variable for reading the pushbutton status
int ledState = 0;

void setup() {
  // initialize the LED pin as an output:
 // pinMode(ledPin, OUTPUT);      
 Serial.begin(9600);
  pinMode(buttonLeft, INPUT);
  pinMode(buttonRight, INPUT);
  pinMode(led, OUTPUT);
  
}

void loop(){
  while(Serial.available() > 0) {

digitalWrite(led, ledState);
  buttonState = digitalRead(buttonLeft);
  printState(buttonState);
  buttonState = digitalRead(buttonRight);
  printState(buttonState);
  
  
  Serial.print("x");
  delay(10);
  ledState = Serial.read();
  
  }
  
  
}

void printState(int buttonState) {
  if(buttonState == HIGH) {
    Serial.print(1);
  }else {
    Serial.print(0);
  }
}
