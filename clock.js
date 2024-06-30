const readline = require('readline')
class Alarm {
    constructor(time, daysOfWeek) {
        this.time = time
        this.daysOfWeek = daysOfWeek
        this.isActive = true
        this.snoozeCount = 0
    }

    matches(currentTime, currentDay) {
        return this.isActive && this.time === currentTime && this.daysOfWeek.includes(currentDay)
    }

    snooze(minutes) {
        if (this.snoozeCount < 3) {
            const [hours, mins] = this.time.split(':').map(Number)
            const newMins = (mins + minutes) % 60
            const newHours = (hours + Math.floor((mins + minutes) / 60)) % 24
            this.time = `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
            this.snoozeCount++
        } else {
            console.log('Maximum snooze limit reached.')
        }
    }

    resetSnoozeCount() {
        this.snoozeCount = 0
    }
}

class AlarmClock {
    constructor() {
        this.alarms = []
        this.currentTime = this.getCurrentTime()
        this.currentDay = this.getCurrentDay()
    }

    getCurrentTime() {
        const now = new Date()
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    }

    getCurrentDay() {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
    }

    addAlarm(time, daysOfWeek) {
        this.alarms.push(new Alarm(time, daysOfWeek))
    }

    deleteAlarm(index) {
        if (index >= 0 && index < this.alarms.length) {
            this.alarms.splice(index, 1)
            console.log(`Alarm ${index + 1} deleted successfully!`)
        } else {
            console.log('Invalid alarm index.')
        }
    }

    checkAlarms() {
        this.alarms.forEach((alarm, index) => {
            if (alarm.matches(this.currentTime, this.currentDay)) {
                console.log(`Alarm ${index + 1} is ringing.`)
                alarm.resetSnoozeCount()
            }
        })
    }

    displayTime() {
        console.log(`Current time : ${this.currentTime}`)
        console.log(`Current day : ${this.currentDay}`)
    }

    updateTime() {
        this.currentTime = this.getCurrentTime()
        this.currentDay = this.getCurrentDay()
    }
}

const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const alarmClock = new AlarmClock()

function promptUser() {
    readLine.question('Enter option (display/ add/ snooze/ delete/ exit): ', (option) => {
        switch (option.toLowerCase()) {
            case 'display':
                alarmClock.displayTime()
                break
            case 'add':
                readLine.question('Enter alarm time (HH:MM): ', (time) => {
                    readLine.question('Enter days of week (comma-separated): ', (days) => {
                        alarmClock.addAlarm(time, days.split(','))
                        console.log('Alarm added successfully!')
                        promptUser()
                    })
                })
                return
            case 'snooze':
                readLine.question('Enter alarm index to snooze: ', (index) => {
                    readLine.question('Enter snooze time in minutes: ', (minutes) => {
                        alarmClock.alarms[index - 1].snooze(parseInt(minutes))
                        console.log('Alarm snoozed successfully!')
                        promptUser()
                    })
                })
                return
            case 'delete':
                readLine.question('Enter alarm index to delete : ', (index) => {
                    alarmClock.deleteAlarm(parseInt(index) - 1)
                    promptUser()
                })
                return
            case 'exit':
                console.log('Thankyou for using clock alarm.')
                readLine.close()
                return
            default:
                console.log('Invalid option. Please try again.')
        }
        promptUser()
    })
}

console.log('Alarm Clock Program')
promptUser()

setInterval(() => {
    alarmClock.updateTime()
    alarmClock.checkAlarms()
}, 60 * 1000)