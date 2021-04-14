const Job = require("../model/Job");
const Profile = require("../model/Profile");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  create(req, res) {
    return res.render("job");
  },
  async save(req, res) {
    // req.body ={ name: hshs, daily-hours: 3.1 ...}
    await Job.create({
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(), // atribuindo data atual
    });
    return res.redirect("/");
  },
  async show(req, res) {
    const jobs = await Job.get();
    const jobId = req.params.id;

    const job = jobs.find((job) => job.id == jobId);

    if (!job) {
      return res.send(404);
    }

    const profile = await Profile.get();

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

    return res.render("job-edit", { job });
  },
  async update(req, res) {
    const jobId = req.params.id;

    const updatedJob = {
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    await Job.update(updatedJob, jobId);

    res.redirect("/job/" + jobId);
  },
  delete(req, res) {
    const jobId = req.params.id;

    Job.delete(jobId);

    return res.redirect("/");
  },
};
