class Alarm {
    constructor(hour, minute, dayOfWeek) {
        this.hour = hour;
        this.minute = minute;
        this.dayOfWeek = dayOfWeek;
        this.isActive = true;
    }

    toString() {
        return `Alarm set for ${this.dayOfWeek} at ${this.hour.toString().padStart(2, '0')}:${this.minute.toString().padStart(2, '0')}`;
    }
}

class AlarmClock {
    constructor() {
        this.alarms = [];
        this.snoozeDuration = 3 * 60 * 1000;
        this.currentTime = new Date();
        this.updateTime();
    }

    updateTime() {
        setInterval(() => {
            this.currentTime = new Date();
            this.checkAlarms();
            this.displayTime();
        }, 1000);
    }

    displayTime() {
        const currentTimeStr = this.currentTime.toLocaleTimeString();
        document.getElementById('current-time').textContent = currentTimeStr;
    }

    addAlarm(hour, minute, dayOfWeek) {
        const newAlarm = new Alarm(hour, minute, dayOfWeek);
        this.alarms.push(newAlarm);
        this.renderAlarms();
    }

    snoozeAlarm(alarmIndex) {
        if (alarmIndex >= 0 && alarmIndex < this.alarms.length) {
            const alarm = this.alarms[alarmIndex];
            if (!alarm.isActive) {
                const snoozeTime = new Date(this.currentTime.getTime() + this.snoozeDuration);
                alarm.hour = snoozeTime.getHours();
                alarm.minute = snoozeTime.getMinutes();
                alarm.isActive = true;
                this.renderAlarms();
            }
        }
    }

    deleteAlarm(alarmIndex) {
        if (alarmIndex >= 0 && alarmIndex < this.alarms.length) {
            this.alarms.splice(alarmIndex, 1);
            this.renderAlarms();
        }
    }

    checkAlarms() {
        for (const alarm of this.alarms) {
            if (this.isAlarmTime(alarm) && alarm.isActive) {
                alert(`ALARM! ${alarm}`);
                alarm.isActive = false;
            }
        }
    }

    isAlarmTime(alarm) {
        const currentDay = this.currentTime.toLocaleString('en-US', { weekday: 'long' });
        return currentDay === alarm.dayOfWeek &&
            this.currentTime.getHours() === alarm.hour &&
            this.currentTime.getMinutes() === alarm.minute &&
            this.currentTime.getSeconds() === 0;
    }

    renderAlarms() {
        const alarmsList = document.getElementById('alarmsList');
        alarmsList.innerHTML = '';
        this.alarms.forEach((alarm, idx) => {
            const alarmElement = document.createElement('li');
            alarmElement.textContent = `${alarm} - ${alarm.isActive ? "Active" : "Inactive"}`;
            const snoozeButton = document.createElement('button');
            snoozeButton.textContent = 'Snooze';
            snoozeButton.addEventListener('click', () => this.snoozeAlarm(idx));
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => this.deleteAlarm(idx));
            alarmElement.appendChild(snoozeButton);
            alarmElement.appendChild(deleteButton);
            alarmsList.appendChild(alarmElement);
        });
    }
}

const clock = new AlarmClock();

document.getElementById('alarmForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const hour = parseInt(document.getElementById('hour').value);
    const minute = parseInt(document.getElementById('minute').value);
    const dayOfWeek = document.getElementById('dayOfWeek').value;
    clock.addAlarm(hour, minute, dayOfWeek);
    event.target.reset();
});
