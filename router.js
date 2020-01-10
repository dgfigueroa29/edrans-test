'use strict';

function router(router) {
    const middleware = require('./middleware')(),
        career = require('./route/career')(),
        student = require('./route/student')(),
        subject = require('./route/subject')();

    //GET routes:
    router.route('/students/').get(student.getAll);
    router.route('/students/:id').get(middleware.checkId, student.getById);

    router.route('/careers/').get(career.getAll);
    router.route('/careers/:id').get(middleware.checkId, career.getById);

    router.route('/subjects/').get(subject.getAll);
    router.route('/subjects/:id').get(middleware.checkId, subject.getById);

    //POST routes:
    router.route('/students/').post(middleware.createStudent, student.create);
    router.route('/careers/').post(middleware.createCareer, career.create);
    router.route('/subjects/').post(middleware.createSubject, subject.create);

    //PUT routes:
    router.route('/students/:id').put(middleware.checkId, middleware.createStudent, student.create);
    router.route('/careers/:id').put(middleware.checkId, middleware.createCareer, career.create);
    router.route('/subjects/:id').put(middleware.checkId, middleware.createSubject, subject.create);
    router.route('/students/:id/careers').put(middleware.checkId, middleware.createStudent, student.create);
    router.route('/students/:id/subjects').put(middleware.checkId, middleware.createStudent, student.create);
}

module.exports = router;
