const Resume = require('./models/Resume')
const WorkingHistory = require('./models/WorkingHistory')
const Education = require('./models/Education')
const ForeignLanguage = require('./models/ForeignLanguage')
const resumeEmploymentType = require('./models/resumeEmploymentType')  
const employmentType = require('../employment-type/employmentType')
const City = require('../region/city')
const Country = require('../region/country')
const { Op } = require('sequelize')

const createResume = async(req, res) => {

    // console.log(req.body, req.user);
    const resume = await Resume.create [{
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        position: req.body.position,
        cityId: req.body.cityId,
        citizenship: req.body.citizenship,
        about: req.body.about,
        birthday: req.body.birthday,
        gender: req.body.gender,
        salary: req.body.salary,
        salary_type: req.body.salary_type,
        main_language: req.body.main_language,
        skills: req.body.skills,
        userId: req.user.id,
    }]

    if(req.body.workingHistories && req.body.workingHistories.length > 0){
        req.body.workingHistories.forEach( async history => {
            await WorkingHistory.create({
                resumeId: resume.id,
                company_name: history.company_name,
                company_description: history.company_description,
                responsibilities: history.responsibilities,
                start_date: history.start_date,
                end_date: history.end_date  
            })
        })
    }

    if(req.body.education && req.body.education.length > 0){
        req.body.education.forEach( async edu => {
            await Education.create({
                resumeId: resume.id,
                level: edu.level,
                university_name: edu.university_name,
                faculty: edu.faculty,
                major: edu.major,
                end_date: edu.end_date  
            })
        })
    }

    if(req.body.foreignLanguages && req.body.foreignLanguages.length > 0){
        req.body.education.forEach( async ln => {
            await ForeignLanguage.create({
                resumeId: resume.id,
                level: ln.level,
                name: ln.name,

            })
        })
    }

    if(req.body.employmentTypes && req.body.employmentTypes.length > 0){
        req.body.employmentTypes.forEach( async employmentTypeId => {
            await resumeEmploymentType.create({
                resumeId: resume.id,
                employmentTypeId: employmentTypeId

            })
        })
    }

    res.status(200).send(resume);
}

const getMyResumes = async (req, res) => {

        const resumes = await Resume.findAll({where: {userId: req.user.id}});
        res.status(200).send(resumes)
}

const getResume = async (req, res) => {

    const resume = await Resume.findByPk(req.params.id, {
        include:[ 
            {
                model: WorkingHistory,
                as: 'workingHistories'
            },
            {
                model: Education,
                as: 'education'
            },
            {
                model: employmentType,
                as: 'employmentTypes'
            },
            {
                model: ForeignLanguage,
                as: 'foreignLanguage'
            },
            {
                model: City,
                as: 'city'
            },
            {
                model: Country,
                as: 'citizenship'
            },
        ]
     
    });
    res.status(200).send(resume)
}

const deleteResume = async (req, res) => {
    const data = await Resume.destroy({
        where: {
            id: req.params.id,
        },
    })
    // console.log(data);
    res.status(200).end()
}

const editResume = async(req, res) => {
     await Resume.update [{
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        position: req.body.position,
        cityId: req.body.cityId,
        citizenship: req.body.citizenship,
        about: req.body.about,
        birthday: req.body.birthday,
        gender: req.body.gender,
        salary: req.body.salary,
        salary_type: req.body.salary_type,
        main_language: req.body.main_language,
        skills: req.body.skills,
        userId: req.user.id,
    }, 
    {
        where: {
            id: req.body.id
        }
    }]

    await WorkingHistory.destroy({
        where: {
            resumeId: req.body.id
        }
    })

    await Education.destroy({
        where: {
            resumeId: req.body.id
        }
    })

    await resumeEmploymentType.destroy({
        where: {
            resumeId: req.body.id
        }
    })

    await foreignLanguages.destroy({
        where: {
            resumeId: req.body.id
        }
    })
        
    const resume = {
        id: req.body.id
    }

        if(req.body.workingHistories && req.body.workingHistories.length > 0){
            req.body.workingHistories.forEach( async history => {
                await WorkingHistory.create({
                    resumeId: resume.id,
                    company_name: history.company_name,
                    company_description: history.company_description,
                    responsibilities: history.responsibilities,
                    start_date: history.start_date,
                    end_date: history.end_date  
                })
            })
        }
    
        if(req.body.education && req.body.education.length > 0){
            req.body.education.forEach( async edu => {
                await Education.create({
                    resumeId: resume.id,
                    level: edu.level,
                    university_name: edu.university_name,
                    faculty: edu.faculty,
                    major: edu.major,
                    end_date: edu.end_date  
                })
            })
        }
    
        if(req.body.foreignLanguages && req.body.foreignLanguages.length > 0){
            req.body.education.forEach( async ln => {
                await ForeignLanguage.create({
                    resumeId: resume.id,
                    level: ln.level,
                    name: ln.name,
    
                })
            })
        }
    
        if(req.body.employmentTypes && req.body.employmentTypes.length > 0){
            req.body.employmentTypes.forEach( async employmentTypeId => {
                await resumeEmploymentType.create({
                    resumeId: resume.id,
                    employmentTypeId: employmentTypeId
    
                })
            })
        }
        res.status(200).end()
}

const searchResume = async (req, res) => {
    const options = {}
    const {q, cityId, salary_from, salary_to, salary_type, citizenship} = req.query
    if(q) {
        options.where = {
            [Op.or]: [
                {first_name: {[Op.iLike]:'%{q}%'}},
                {last_name: {[Op.iLike]:'%{q}%'}},
                {position: {[Op.iLike]:'%{q}%'}},
                {about: {[Op.iLike]:'%{q}%'}},
                {skills: {[Op.iLike]:'%{q}%'}},
            ]
        };
    }
    
    if(citizenship){
        options.citizenship=citizenship;
    }
    if(cityId) {
        options.cityId = cityId;
    }

    if(salary_from && !salary_to){
        options.salary_from = {[Op.gte]: salary_from*1}
    }
    else if(!salary_from && !salary_to){
        options.salary_from = {[Op.lte]: salary_to*1}
    }
    else if(salary_from && salary_to){
        options.salary_from = {[Op.between]: [salary_from*1, salary_to*1]}
    }



    if(salary_type){
        options.salary_type = salary_type;
    }
    // if(salary){
    //     options.salary_from = {[Op.lte]: salary}
    //     options.salary_from = {[Op.gte]: salary}

        // if (salary) {
        //     options.where = {
        //         ...options.where,
        //         salary: {
        //             [Op.gte]: salary, // Greater than or equal to the provided salary
        //         }
        //     };
        // }

    
        // // Assuming you have 'salary_from' and 'salary_gte' attributes in your model
        // if (salary) {
        //     options.where = {
        //         ...options.where,
        //         salary_from: {
        //             [Op.lte]: salary, // Less than or equal to the provided salary
        //         },
        //     };
        // }
    // }

    const resumes = await Resume.findAll({
        where: options
    })
    res.status(200).send(resumes)
}

module.exports = {
    createResume,
    getMyResumes,
    getResume,
    deleteResume,
    editResume,
    searchResume
}