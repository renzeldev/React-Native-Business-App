const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
const isEmpty = require('../../validation/is-empty');
const User = require('../../models/User');
const StateMessage = require('../../models/StateMessage');
const Task = require('../../models/Task');

router.post('/addEvent/:user', (req, res) => {
	console.log(req.body);
	
	Task.findOne({user: req.params.user})
	.then(task => {
		if(task) {
			task.events.unshift(req.body);
			task.save();
		} else {
			const newTask = new Task ({
				user: req.params.user,
				events:[req.body]
			})
			newTask.save();
		}
	})
	res.end("eeendddd");
})

router.post('/removeEvent/:user', (req, res) => {

	Task.findOne({user: req.params.user})
	.then(task => {
		if(task) {
			for(var i = 0; i < task.events.length ; i++) {
				if(task.events[i].title == req.body.title && task.events[i].allDay.toString() == req.body.allDay && task.events[i].start.toString() == req.body.start) {
					//console.log(task.events[i]);
					if(task.events[i].end == undefined && req.body.end == undefined) {
						task.events.splice(i, 1);
						task.save();
					}
					if(task.events[i].end != undefined && req.body.end != undefined && task.events[i].end.toString() == req.body.end) {
						task.events.splice(i, 1);
						task.save();
					}
					break;
				}
			}
			res.end("sdfdfdf");
		}
	})
	res.end("eeendddd");
})

router.get('/getAllEvents/:user', (req, res) => {
	console.log('getAllEvents', req.params.user);
	Task.findOne({user: req.params.user})
	.then(task => {
		if(task) {
			res.json(task.events);
		} else {
			res.json([]);
		}
	})
	.catch(err => res.json([]));
})

// router.post('/modifyEvents/:user', (req, res) => {
// 	Task.findOne({user: req.params.user})
// 	.then(task => {
// 		if(task) {
// 			console.log("out", req.body);
// 			if(Object.keys(req.body).length == 0) {
// 				console.log("ssd", req.body);
// 				res.end("ssd");
// 			} else {
// 				console.log("in", req.body);
// 				task.events = [];
// 				task.save();
// 				req.body.events.map(item => {
// 					const newTask = {
// 						title: item.title,
// 						backgroundColor: item.backgroundColor,
// 						start: item.start,
// 						end: item.end,
// 						allDay: item.allDay
// 					}
// 					task.events.unshift(newTask);
// 				})
// 				//task.events = req.body.events;
// 				task.save();
// 				res.end("sdf");
// 			}
// 		} else {
// 			//console.log(req.body);
// 			const newTask = new Task ({
// 				user: req.params.user
// 			})
// 			const task = {
// 				title:req.body.events[0].title,
// 				backgroundColor: req.body.events[0].backgroundColor,
// 				start: req.body.events[0].start,
// 				allDay: req.body.events[0].allDay
// 			}
// 			//task.event.allDay = Boolean(req.body.allDay);
// 			newTask.events.unshift(task);
// 			//console.log(newTask.user);
// 			newTask.save();
// 			res.end("sdf");
// 		}
// 	})
// })
router.get('/isTodayEvent/', passport.authenticate('jwt', {session:false}), (req, res) => {
	Task.findOne({user: req.user.handle})
	.then(task => {
		if(task) {
			var todayObj = new Date();
			var tYear = todayObj.getFullYear();
			var tMonth = todayObj.getMonth();
			var tDate = todayObj.getDate();
			var flag = false;
			for(var i = 0; i < task.events.length ; i++) {
				if(task.events[i].end == undefined) {
					var startDateObjString = task.events[i].start.toISOString();
					// console.log(startDateObjString, task.events[i]);
					var startDateRealObj = new Date(
						Number(startDateObjString.split('T')[0].split('-')[0]),
						Number(startDateObjString.split('T')[0].split('-')[1])-1,
						Number(startDateObjString.split('T')[0].split('-')[2]),
						0,0,0
					).getTime();
					var endDateRealObj = new Date(
						Number(startDateObjString.split('T')[0].split('-')[0]),
						Number(startDateObjString.split('T')[0].split('-')[1])-1,
						Number(startDateObjString.split('T')[0].split('-')[2]),
						23,59,59
					).getTime();
					if(startDateRealObj <= todayObj.getTime() && todayObj.getTime() <= endDateRealObj) {
						flag = true;
						break;
					}
				} else {
					var startDateObjString = task.events[i].start.toISOString();
					var startDateRealObj = new Date(
						Number(startDateObjString.split('T')[0].split('-')[0]),
						Number(startDateObjString.split('T')[0].split('-')[1])-1,
						Number(startDateObjString.split('T')[0].split('-')[2]),
						0,0,0
					).getTime();
					var endDateObjString = task.events[i].end.toISOString();
					var endDateRealObj
					if(endDateObjString.split('T')[1].split('.')[0] == '00:00:00') {
						endDateRealObj = new Date(
							Number(endDateObjString.split('T')[0].split('-')[0]),
							Number(endDateObjString.split('T')[0].split('-')[1])-1,
							Number(endDateObjString.split('T')[0].split('-')[2]),
							0,0,0
						).getTime();
					} else {
						endDateRealObj = new Date(
							Number(endDateObjString.split('T')[0].split('-')[0]),
							Number(endDateObjString.split('T')[0].split('-')[1])-1,
							Number(endDateObjString.split('T')[0].split('-')[2]),
							23,59,59
						).getTime();
					}
					
					if(startDateRealObj <= todayObj.getTime() && todayObj.getTime() <= endDateRealObj) {
						flag = true;
						break;
					}
				}
			}
			if(flag) {
				res.json("true")
			} else {
				res.json("false");
			}
		} else {
			res.json("false");
		}
	})
	.catch(err => res.status(404).json(err));
})
router.post('/modifyEvents/:user', (req, res) => {
	Task.findOne({user: req.params.user})
	.then(task => {
		if(task) {
			var oldEvent = req.body.oldEvent;
			var newEvent = req.body.newEvent;
			for(var i = 0; i < task.events.length ; i++) {
				if(task.events[i].title == oldEvent.title && task.events[i].allDay.toString() == oldEvent.allDay && task.events[i].start.toString() == oldEvent.start) {
					if(task.events[i].end == undefined && oldEvent.end == undefined) {
						task.events.splice(i, 1);
						task.save();
						task.events.unshift(newEvent);
						task.save();
					}
					if(task.events[i].end != undefined && oldEvent.end != undefined && task.events[i].end.toString() == oldEvent.end) {
						task.events.splice(i, 1);
						task.save();
						task.events.unshift(newEvent);
						task.save();
					}
					break;
				}
			}
		}
		res.end("sdf");
	})
})

router.get('/getTodayTask', passport.authenticate('jwt', {session:false}), (req, res) => {
	Task.findOne({user: req.user.handle})
	.then(mytask => {
		var todayObj = new Date();
		var tYear = todayObj.getFullYear();
		var tMonth = todayObj.getMonth();
		var tDate = todayObj.getDate();
		var todayTask = mytask.Tasks.filter(item => 
			item.date.getFullYear() == tYear && item.date.getMonth() == tMonth && item.date.getDate() == tDate
		)[0];
		res.json(todayTask.tasks);
	})
	.catch(err => res.status(404).json({식별자:"해당한 식별자를 찾을수 없습니다."}));
})

router.post('/getTaskHistory', passport.authenticate('jwt', {session:false}), (req, res) => {
	console.log("sddfdfdfdfd");
	Task.findOne({user: req.user.handle})
	.then(mytask => {
		var historyTasks = [];
		
		mytask.Tasks.map(item => {
			if(item.date.getFullYear().toString() == req.body.year && item.date.getMonth().toString() == req.body.month) {
				historyTasks = [...historyTasks, {date:item.date.toLocaleString(), tasks: item.tasks}];
			}
		})

		res.json(historyTasks);
	})
	.catch(err => res.status(404).json({식별자:"해당한 식별자를 찾을수 없습니다."}));
})

router.post('/addTodayTask', passport.authenticate('jwt', {session:false}), (req, res) => {
	Task.findOne({user: req.user.handle})
	.then(mytask => {
		if(mytask) {
			var todayObj = new Date();
			var tYear = todayObj.getFullYear();
			var tMonth = todayObj.getMonth();
			var tDate = todayObj.getDate();
			var todayTask = mytask.Tasks.filter(item => 
				item.date.getFullYear() == tYear && item.date.getMonth() == tMonth && item.date.getDate() == tDate
			)[0];
			const newTodaytask = {
				title: req.body.title,
				status: false
			}
			if(todayTask == undefined) {
				const newtask = {
					tasks:[newTodaytask]
				};
				mytask.Tasks.unshift(newtask);
				mytask.save();
				res.json([mytask.Tasks.filter(item => 
					item.date.getFullYear() == tYear && item.date.getMonth() == tMonth && item.date.getDate() == tDate
					)[0].tasks[0]])
			} else {
				todayTask.tasks.unshift(newTodaytask);
				mytask.save();
				res.json([todayTask.tasks[0]]);
			}
		} else {
			const newTodaytask = {
				title: req.body.title,
				status: false
			}
			const newTask = new Task ({
				user: req.user.handle,
				Tasks:[{
					date:Date.now(),
					tasks:[newTodaytask]
				}]
			})
			newTask.save();
			res.json([newTask.Tasks[0].tasks[0]]);
		}
	})
	.catch(err => res.status(404).json({식별자:"해당한 식별자를 찾을수 없습니다."}));
})

router.get('/setTaskStatus/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
	Task.findOne({user: req.user.handle})
	.then(mytask => {
		var todayObj = new Date();
		var tYear = todayObj.getFullYear();
		var tMonth = todayObj.getMonth();
		var tDate = todayObj.getDate();
		var todayTask = mytask.Tasks.filter(item => 
			item.date.getFullYear() == tYear && item.date.getMonth() == tMonth && item.date.getDate() == tDate
		)[0];
		const index = todayTask.tasks.map(item => item._id.toString()).indexOf(req.params.id);
		todayTask.tasks[index].status = !todayTask.tasks[index].status;
		mytask.save();
		res.json(todayTask.tasks[index]);
	})
	.catch(err => res.status(404).json({식별자:"해당한 식별자를 찾을수 없습니다."}));
})

router.get('/getFailedTasks', passport.authenticate('jwt', {session:false}), (req, res) => {
	Task.findOne({user: req.user.handle})
	.then(mytask => {
		var failedTasks = [];
		var todayObj = new Date();
		var tYear = todayObj.getFullYear();
		var tMonth = todayObj.getMonth();
		var tDate = todayObj.getDate();
		mytask.Tasks.map(item => {
			if(item.date.getFullYear() != tYear || item.date.getMonth() != tMonth || item.date.getDate() != tDate) {
				var failedDayTasks = item.tasks.filter(dt => !dt.status);
				if(failedDayTasks.length != 0) {
					failedTasks = [...failedTasks, {date:item.date.toLocaleString(), tasks:failedDayTasks}];
				}
			}
		})	
		res.json(failedTasks);
	})
	.catch(err => res.status(404).json({식별자:"해당한 식별자를 찾을수 없습니다."}));
})

router.post('/setPreTaskStatus', passport.authenticate('jwt', {session:false}), (req, res) => {
	Task.findOne({user: req.user.handle})
	.then(mytask => {
		var thatDayTask;
		mytask.Tasks.map(item => {
			if(item.tasks.filter(t => t._id == req.body.id).length == 1) {
				thatDayTask = item;
			}
		})
		const index = thatDayTask.tasks.map(item => item._id.toString()).indexOf(req.body.id);
		thatDayTask.tasks[index].status = !thatDayTask.tasks[index].status;
		mytask.save();
		res.json({pre:{date: req.body.date, tasks:thatDayTask.tasks.filter(item => !item.status)}, id:thatDayTask.tasks[index]._id});
	})
	.catch(err => res.status(404).json({식별자:"해당한 식별자를 찾을수 없습니다."}));
})

router.get('/getEvent', (req, res) => {
	res.json("ssssssss");
})

module.exports = router;