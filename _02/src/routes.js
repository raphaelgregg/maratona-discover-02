const express = require('express');
const routes = express.Router();

// EJS ja le por padrão a pasta VIEWS
// const 'dirname + '/views';

const views = __dirname + '/views/';

const Profile = {
  data: {
    name: "Gregg",
    avatar: "https://github.com/raphaelgregg.png",
    monthlyBudget: 3000,
    daysPerWeek: 5,
    hoursPerDay: 5,
    vacationPerYear: 4,
    valueHour: 75,
  },
  controllers: {
    index(req, res) {
      return res.render(views + 'profile', {profile: Profile.data})
    },
    update(req, res) {
      // req.body ara pegar dados
      const data = req.body;
      // definir quantas semanas tem um atribuindo
      const weeksPerYear = 52;
      // remover as semanas de ferias do ano, para pegar quantas semanas tem em 1 mes
      const weeksPerMonth = (weeksPerYear - data["days-per-week"]) / 12;
      // quantas horas por semana estou trabalhando
      const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
      // total de horas trabalhadas no mes
      const monthlyTotalHours = weekTotalHours * weeksPerMonth;
      // qual valor da minha hora?
      const hour = data["value-hour"] = data["monthly-budget"] / monthlyTotalHours;

      Profile.data = {
        ...Profile.data,
        ...req.body,
        valueHour: hour
      }

      return res.redirect('/profile')
    },
  }
}

const Job = {
  data: [
    {
      id: 1,
      name: "Pizzaria Guloso",
      dailyHours: 2,
      totalHours: 1,
      created_at: Date.now(),
    },
    {
      id: 2,
      name: "OneTwo Project",
      dailyHours: 3,
      totalHours: 47,
      created_at: Date.now(),
    } 
  ],
  controllers: {
    index(req, res) {
        const updatedJobs  = Job.data.map((job) => {
          // ajustes no job
          const remaining = Job.services.remainingDays(job);
          const status = remaining <= 0 ? "done" : "progress"
      
          console.log(Profile.data.valueHour * job.totalHours)
          return {
            ...job, 
            remaining, 
            status,
            budget: Job.services.calculateBudget(job, Profile.data.valueHour),
          };
        })
      
        return res.render(views + 'index', {jobs: updatedJobs});
    },
    create(req, res) {
      return res.render(views + 'job');
    },
    save(req, res) {
      // req.body ={ name: hshs, daily-hours: 3.1 ...}
        const lastId = Job.data[Job.data.length - 1]?.id || 0;
        console.log(Job.data)
        Job.data.push({
          id: lastId + 1,
          name: req.body.name,
          dailyHours: req.body['daily-hours'],
          totalHours: req.body['total-hours'],
          created_at: Date.now() // atribuindo data atual
        });
        return res.redirect('/');
    },
    show(req, res) {
      const jobId = req.params.id;

      const job = Job.data.find(job => job.id == jobId);

      if(!job){
        return res.send(404);
      }

      job.budget = Job.services.calculateBudget(job, Profile.data.valueHour);
     
      return res.render(views + 'job-edit', {job})
    },
    update(req, res) {
      const jobId = req.params.id;

      const job = Job.data.find(job => job.id == jobId);

      if(!job){
        return res.send(404);
      }

      const updatedJob = {
        ...job,
        name: req.body.name,
        totalHours: req.body['total-hours'],
        dailyHours: req.body['daily-hours'],
      }

      Job.data = Job.data.map(job => {
        if(job.id == jobId) {
          job = updatedJob
        }

        return job;
      })

      res.redirect('/job/'+ jobId);  
    },
    delete(req, res) {
      const jobId = req.params.id;

      Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId));

      return res.redirect('/')
    }
  },
    services: {
      remainingDays(job) {
        // calculo de tempo restante
        const remainingDays = (job.totalHours / job.dailyHours).toFixed();
          
          const createdDate = new Date(job.created_at);
          const dueDay = createdDate.getDate() + Number(remainingDays);
          const dueDateInMs = createdDate.setDate(dueDay);
      
          const timeDiffInMs = dueDateInMs - Date.now();
          // transformar milli em dias
          const dayInMs = 1000 * 60 * 60 * 24;
          const dayDiff = Math.floor(timeDiffInMs / dayInMs);
      
          //restam x dias
          return dayDiff;
      },
      calculateBudget: (job, valueHour) => valueHour * job.totalHours, 
  },
}



// req, res
routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);

routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);

routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;