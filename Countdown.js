// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: hourglass-half;
// Version 1.2.1

let dateForCountdown = ''
let icon = ''
let showDate = false

let widgetInputRAW = args.widgetParameter;
let widgetInput = null;

if (widgetInputRAW !== null) {
  widgetInput = widgetInputRAW.toString().split(";");
  if (/^\d{4}-\d{2}-\d{2}$/.test(widgetInput[0].trim()) === false) {
     throw new Error('Invalid Date format. Please format: 2020-12-31') 
  }
  dateForCountdown = widgetInput[0].trim()
  icon = widgetInput[1] || '⏳';
  if (widgetInput[2] && widgetInput[2].toLowerCase() === 'true') {
    showDate = true
  }
} else {
  throw new Error('No Date set! Please format: 2020-12-31')
}

////////////////////////////////////////////////////////////////////////////////
const localeText = {
  default: ['Day', 'Days'],
  en: ['Day', 'Days'],
  de: ['Tag', 'Tage'],
  fr: ['Jour', 'Jours'],
  es: ['día', 'días'],
  it: ['giorno', 'giorni']
}
////////////////////////////////////////////////////////////////////////////////
let backColor; //Widget background color
let backColor2; //Widget background color
let textColor; //Widget text color

if (Device.isUsingDarkAppearance()) {
  backColor = '111111';
  backColor2 = '222222';
  textColor = 'EDEDED';
} else {
  backColor = 'A04000';
  backColor2 = 'DC7633';
  textColor = 'EDEDED';
}

function getTimeRemaining(endtime){
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor( (total/1000) % 60 );
  const minutes = Math.floor( (total/1000/60) % 60 );
  const hours = Math.floor( (total/(1000*60*60)) % 24 );
  const days = Math.floor( total/(1000*60*60*24) );

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

let remainingDays = getTimeRemaining(dateForCountdown).days;
let remainingHours = getTimeRemaining(dateForCountdown).hours;
let remainingMinutes = getTimeRemaining(dateForCountdown).minutes;
let remainingSeconds = getTimeRemaining(dateForCountdown).seconds;


// Create Widget
let widget = new ListWidget();

widget.setPadding(10, 10, 10, 10)

const gradient = new LinearGradient()
gradient.locations = [0, 1]
gradient.colors = [
  new Color(backColor),
  new Color(backColor2)
]
widget.backgroundGradient = gradient

let provider = widget.addText(icon + "  to Target-Date")
provider.font = Font.mediumSystemFont(12)
provider.textColor = new Color(textColor)

widget.addSpacer()

let textStack = widget.addStack();
textStack.layoutHorizontally()
textStack.addSpacer()
textStack.centerAlignContent()

let daysText = textStack.addText(`${remainingDays}`)
daysText.font = Font.regularSystemFont(50)
daysText.textColor = new Color(textColor);
daysText.minimumScaleFactor = 0.5;

widget.addSpacer()

const languageCode = Device.preferredLanguages()[0].match(/^[\a-z]{2}/)
const t = (localeText[languageCode]) ? localeText[languageCode] : localeText.default
let postfixText;
if (remainingDays === 1) {
  postfixText = textStack.addText(t[0])

} else {
  postfixText = textStack.addText(t[1])
}
postfixText.font = Font.regularSystemFont(15)
postfixText.textColor = new Color(textColor);

let textStack2 = widget.addStack();
textStack2.layoutHorizontally()
textStack2.addSpacer()
textStack2.centerAlignContent()

let hoursText = textStack2.addText(`${remainingHours}` + ' h ')
hoursText.font = Font.regularSystemFont(15)
hoursText.textColor = new Color(textColor);
hoursText.minimumScaleFactor = 0.5;

let minutesText = textStack2.addText(`${remainingMinutes}` + ' m')
minutesText.font = Font.regularSystemFont(15)
minutesText.textColor = new Color(textColor);
minutesText.minimumScaleFactor = 0.5;

let secondsText = textStack2.addText(`${remainingSeconds}` + ' s')
secondsText.font = Font.regularSystemFont(15)
secondsText.textColor = new Color(textColor);
secondsText.minimumScaleFactor = 0.5;

widget.addSpacer()

//if(showDate) {
  const dateText = widget.addDate(new Date(dateForCountdown))
  dateText.font = Font.lightSystemFont(10)
  dateText.textColor = new Color(textColor);
  dateText.centerAlignText()
  widget.addSpacer(5) 
//}

if(!config.runsInWidget) {
  await widget.presentSmall()
} else {
  // Tell the system to show the widget.
  Script.setWidget(widget)
  Script.complete()
}