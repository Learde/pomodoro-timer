let timerApp = new Vue({
    el: '#pomodoro-timer',
    data: {
        //Minutes and seconds
        secondDecimals: 0,
        secondUnits: 0,
        minuteDecimals: 0,
        minuteUnits: 0,
        //Minutes of pomodoro
        pomodoro: {
            mins: 25,
            minDecimals: 2,
            minUnits: 5
        },
        //Minutes of breaks
        shortBreak: {
            mins: 5,
            minDecimals: 0,
            minUnits: 5
        },
        longBreak: {
            mins: 15,
            minDecimals: 1,
            minUnits: 5
        },
        //Boolean variables
        isTimerStarted: 0,
        isBreak: 0,
        isLongBreak: 0,
        isStartPressed: 0,
        isNowPomodoro: 1,
        wasTimerPaused: 0,
        wasAmountChanged: 0,
        autostartBreak: 0,
        autostartPomodoro: 0,
        //Save timerId
        timerId: 0,
        //Period of long break
        periodLongBreak: 4,
        //Amount of pomodoros
        amount: 0,
        //Iterator-helper
        i: 0
    },
    computed: {
        timer: function () {
            return `${this.minuteDecimals}${this.minuteUnits}:${this.secondDecimals}${this.secondUnits}`
        }
    },
    methods: {
        setPomodoroTime: function () {
            this.minuteDecimals = this.pomodoro.minDecimals
            this.minuteUnits = this.pomodoro.minUnits
        },

        setBreakTime: function () {
            this.minuteDecimals = this.shortBreak.minDecimals
            this.minuteUnits = this.shortBreak.minUnits
        },

        setLongBreakTime: function () {
            this.minuteDecimals = this.longBreak.minDecimals
            this.minuteUnits = this.longBreak.minUnits
        },

        setPomodoroMinutes: function () {
            let mins = String(this.pomodoro.mins).split('')
            this.pomodoro.minUnits = +mins[mins.length-1]
            mins.pop()
            this.pomodoro.minDecimals = +mins.join('')

            //If timer stopped set time to timer
            if (!this.isTimerStarted && !this.wasTimerPaused) { this.setPomodoroTime() }
        },

        setBreakMinutes: function () {
            let mins = String(this.shortBreak.mins).split('')
            this.shortBreak.minUnits = +mins[mins.length-1]
            mins.pop()
            this.shortBreak.minDecimals = +mins.join('')

            //If timer stopped set time to timer
            if (!this.isTimerStarted && !this.wasTimerPaused) { this.setBreakTime() }
        },

        setLongBreakMinutes: function () {
            let mins = String(this.longBreak.mins).split('')
            this.longBreak.minUnits = +mins[mins.length-1]
            mins.pop()
            this.longBreak.minDecimals = +mins.join('')

            //If timer stopped set time to timer
            if (!this.isTimerStarted && !this.wasTimerPaused) { this.setLongBreakTime() }
        },

        startTimer: function () {
            //Save context
            let safe = this

            this.timerId = setTimeout(function tick() {
                safe.isTimerStarted = 1
                if (safe.secondDecimals === 0 && safe.secondUnits === 0) {
                    if (safe.minuteUnits === 0 && safe.minuteDecimals === 0) {
                        //Reset boolean values
                        safe.isTimerStarted = 0
                        safe.wasAmountChanged = 0
                        safe.wasTimerPaused = 0
                        safe.isNowPomodoro = 0
                        safe.isStartPressed = 0


                        if (safe.i === 4) {
                            safe.isLongBreak = 1
                            safe.setLongBreakTime()
                            safe.i = 0
                            if (safe.autostartBreak) { safe.startLongBreak() }
                        } else if (!safe.isBreak && !safe.isLongBreak) {
                            safe.isBreak = 1
                            safe.setBreakTime()
                            if (safe.autostartBreak) { safe.startBreak() }
                        } else {
                            safe.isBreak = 0
                            safe.isLongBreak = 0
                            safe.isNowPomodoro = 1
                            safe.setPomodoroTime()
                            if (safe.autostartPomodoro) { safe.startPomodoro() }
                        }
                        return
                    } else if (safe.minuteUnits === 0 && safe.minuteDecimals !== 0) {
                        safe.minuteDecimals--
                        safe.minuteUnits = 9
                    } else if (safe.minuteUnits !== 0) {
                        safe.minuteUnits--
                    }
                    safe.secondDecimals = 5
                    safe.secondUnits = 9
                } else if (safe.secondDecimals !== 0 && safe.secondUnits === 0) {
                    safe.secondDecimals--
                    safe.secondUnits = 9
                } else if (safe.secondUnits !== 0) {
                    safe.secondUnits--
                }

                safe.timerId = setTimeout(tick, 1000);
            }, 1000)
        },

        startPomodoro: function () {
            //Check the timer was started or not
            if (this.isTimerStarted) { return }

            //Save minutes for reset the timer
            if (!this.wasTimerPaused) {
                //Set time of pomodoro to timer
                this.setPomodoroTime()
            }

            if (!this.wasAmountChanged) {
                //Change iterator
                this.i++

                //Change amount of pomodoroes
                this.amount++

                //Block amount changing
                this.wasAmountChanged = 1
            }

            //Show pause button
            this.isStartPressed = 1

            //Show stop button
            this.isNowPomodoro = 1

            //Start timer
            this.startTimer()
        },

        startBreak: function () {
            //Check the timer was started or not
            if (this.isTimerStarted) { return }

            //Save minutes for reset the timer
            if (!this.wasTimerPaused) {
                //Set time of break to timer
                this.setBreakTime()
            }

            //Show pause button
            this.isStartPressed = 1

            //Start timer
            this.startTimer()
        },

        startLongBreak: function () {
            //Check the timer was started or not
            if (this.isTimerStarted) { return }

            //Save minutes for reset the timer
            if (!this.wasTimerPaused) {
                //Set time of break to timer
                this.setLongBreakTime()
            }

            //Show pause button
            this.isStartPressed = 1

            //Start timer
            this.startTimer()
        },

        pauseTimer: function () {
            if (!this.timerId) { return }

            clearTimeout(this.timerId)
            this.isTimerStarted = 0
            this.wasTimerPaused = 1

            //Show start button
            this.isStartPressed = 0
        },

        stopTimer: function () {
            if (!this.timerId) { return }

            clearTimeout(this.timerId)
            this.isTimerStarted = 0
            this.wasTimerPaused = 0

            //Reset values for minutes
            if(this.isLongBreak) { this.setLongBreakTime() }
            else if(this.isBreak) { this.setBreakTime() }
            else { this.setPomodoroTime() }
            this.secondUnits = 0
            this.secondDecimals = 0

            //Show start button
            this.isStartPressed = 0
        },

        skipBreak: function () {
            //Stop timer
            clearTimeout(this.timerId)

            //Reset boolean values
            this.wasAmountChanged = 0
            this.wasTimerPaused = 0
            this.isTimerStarted = 0
            this.isBreak = 0
            this.isLongBreak = 0
            this.isNowPomodoro = 1

            //Set time
            this.setPomodoroTime()

            //Start timer if autostart is true
            if (this.autostartPomodoro) { this.startPomodoro() }
        }
    }
}) 

window.onload = function () {
    timerApp.setPomodoroTime()
}