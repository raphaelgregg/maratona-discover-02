const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    return res.render("profile", { profile: await Profile.get() });
  },
  async update(req, res) {
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
    const hour = (data["value-hour"] =
      data["monthly-budget"] / monthlyTotalHours);

    const profile = await Profile.get();

    await Profile.update({
      ...profile,
      ...req.body,
      valueHour: hour,
    });

    return res.redirect("/profile");
  },
};
