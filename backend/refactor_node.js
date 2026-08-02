const fs = require('fs');
const path = require('path');

const srcRoot = path.join(__dirname, 'src', 'main', 'java');

const classMap = {
    'AuthController': 'com.erp.auth',
    'AuthService': 'com.erp.auth',
    'AuthServiceImpl': 'com.erp.auth',
    'User': 'com.erp.auth',
    'Role': 'com.erp.auth',
    'UserRepository': 'com.erp.auth',
    'LoginRequest': 'com.erp.auth.dto',
    'RegisterRequest': 'com.erp.auth.dto',
    'LoginResponse': 'com.erp.auth.dto',
    'StudentController': 'com.erp.student',
    'StudentService': 'com.erp.student',
    'StudentServiceImpl': 'com.erp.student',
    'Student': 'com.erp.student',
    'StudentRepository': 'com.erp.student',
    'StudentRequest': 'com.erp.student.dto',
    'StudentResponse': 'com.erp.student.dto',
    'TeacherController': 'com.erp.teacher',
    'TeacherService': 'com.erp.teacher',
    'TeacherServiceImpl': 'com.erp.teacher',
    'Teacher': 'com.erp.teacher',
    'TeacherRepository': 'com.erp.teacher',
    'TeacherRequest': 'com.erp.teacher.dto',
    'CourseController': 'com.erp.course',
    'SubjectController': 'com.erp.course',
    'CourseService': 'com.erp.course',
    'CourseServiceImpl': 'com.erp.course',
    'SubjectService': 'com.erp.course',
    'SubjectServiceImpl': 'com.erp.course',
    'Course': 'com.erp.course',
    'Subject': 'com.erp.course',
    'CourseRepository': 'com.erp.course',
    'SubjectRepository': 'com.erp.course',
    'CourseRequest': 'com.erp.course.dto',
    'SubjectRequest': 'com.erp.course.dto',
    'CourseCatalog': 'com.erp.course',
    'AttendanceController': 'com.erp.attendance',
    'AttendanceService': 'com.erp.attendance',
    'AttendanceServiceImpl': 'com.erp.attendance',
    'Attendance': 'com.erp.attendance',
    'AttendanceRepository': 'com.erp.attendance',
    'AttendanceRequest': 'com.erp.attendance.dto',
    'AttendanceResponse': 'com.erp.attendance.dto',
    'MarksController': 'com.erp.marks',
    'MarksService': 'com.erp.marks',
    'MarksServiceImpl': 'com.erp.marks',
    'Marks': 'com.erp.marks',
    'Exam': 'com.erp.marks',
    'MarksRepository': 'com.erp.marks',
    'MarksRequest': 'com.erp.marks.dto',
    'FeesController': 'com.erp.fees',
    'FeesService': 'com.erp.fees',
    'FeesServiceImpl': 'com.erp.fees',
    'Fees': 'com.erp.fees',
    'FeesRepository': 'com.erp.fees',
    'FeesRequest': 'com.erp.fees.dto',
    'TimetableController': 'com.erp.timetable',
    'TimetableService': 'com.erp.timetable',
    'TimetableServiceImpl': 'com.erp.timetable',
    'Timetable': 'com.erp.timetable',
    'TimetableRepository': 'com.erp.timetable',
    'TimetableRequest': 'com.erp.timetable.dto',
    'AnnouncementController': 'com.erp.announcement',
    'AnnouncementService': 'com.erp.announcement',
    'AnnouncementServiceImpl': 'com.erp.announcement',
    'Announcement': 'com.erp.announcement',
    'AnnouncementRepository': 'com.erp.announcement',
    'ReportController': 'com.erp.report',
    'ReportService': 'com.erp.report',
    'ReportServiceImpl': 'com.erp.report',
    'ReportGenerator': 'com.erp.report',
    'AdminController': 'com.erp.admin',
    'GlobalExceptionHandler': 'com.erp.common.exception',
    'ResourceNotFoundException': 'com.erp.common.exception',
    'UnauthorizedException': 'com.erp.common.exception',
    'ApiResponse': 'com.erp.common.dto',
    'Constants': 'com.erp.common.util',
    'DateUtils': 'com.erp.common.util',
    'JwtAuthenticationFilter': 'com.erp.security',
    'JwtUtils': 'com.erp.security',
    'UserDetailsServiceImpl': 'com.erp.security',
    'SecurityConfig': 'com.erp.config',
    'JwtConfig': 'com.erp.config',
    'WebConfig': 'com.erp.config',
    'CourseCatalogInitializer': 'com.erp.config',
    'DemoAccountInitializer': 'com.erp.config'
};

const dummy1 = path.join(srcRoot, 'com', 'erp', 'service', 'ReportGenerator.java');
const dummy2 = path.join(srcRoot, 'com', 'erp', 'service', 'impl', 'ReportGeneratorImpl.java');
if (fs.existsSync(dummy1)) fs.unlinkSync(dummy1);
if (fs.existsSync(dummy2)) fs.unlinkSync(dummy2);

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else if (filePath.endsWith('.java')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const javaFiles = getFiles(srcRoot);

for (const filepath of javaFiles) {
    let content = fs.readFileSync(filepath, 'utf8');

    content = content.replace(/\bUserService\b/g, 'AuthService');
    content = content.replace(/\buserService\b/g, 'authService');

    content = content.replace(/import\s+com\.erp\.model\.Attendance\.AttendanceStatus;/g, 'import com.erp.attendance.Attendance.AttendanceStatus;');

    let filename = path.basename(filepath);
    let classname = filename.replace('.java', '');

    if (classname === 'UserService') classname = 'AuthService';
    if (classname === 'UserServiceImpl') classname = 'AuthServiceImpl';

    let destPath = filepath;
    let newPkg = 'com.erp';

    if (classMap[classname]) {
        newPkg = classMap[classname];
        content = content.replace(/^package\s+com\.erp.*?;/m, "package " + newPkg + ";");

        const destDir = path.join(srcRoot, ...newPkg.split('.'));
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        destPath = path.join(destDir, classname + '.java');
    }

    content = content.replace(/^import\s+com\.erp\.([\w\.]+)\.(\w+)(.*?);/gm, (match, p1, importedClass, rest) => {
        if (importedClass === 'UserService') importedClass = 'AuthService';
        if (importedClass === 'UserServiceImpl') importedClass = 'AuthServiceImpl';

        if (classMap[importedClass]) {
            if (newPkg === classMap[importedClass] && (!rest || rest.trim() === '')) {
                return ''; // remove import if in same package
            }
            return "import " + classMap[importedClass] + "." + importedClass + rest + ";";
        }
        return match;
    });

    if (classname === 'CourseCatalogInitializer') {
        if (!content.includes('import com.erp.course.CourseCatalog;')) {
            content = content.replace(/import org\.springframework/i, "import com.erp.course.CourseCatalog;\nimport org.springframework");
        }
    }

    let importsToAdd = new Set();
    for (const [cls, pkg] of Object.entries(classMap)) {
        if (pkg !== newPkg) {
            const regex = new RegExp("\\b" + cls + "\\b");
            if (regex.test(content)) {
                const importLine = "import " + pkg + "." + cls + ";";
                if (!content.includes(importLine)) {
                    importsToAdd.add(importLine);
                }
            }
        }
    }

    if (importsToAdd.size > 0) {
        const importStr = Array.from(importsToAdd).join('\n');
        content = content.replace(/^(package\s+.*?;\s*)/m, "$1\n" + importStr + "\n");
    }

    fs.writeFileSync(destPath, content, 'utf8');
    if (destPath !== filepath && fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
    }
}

// Ensure application.properties is present
const appPropsDir = path.join(__dirname, 'src', 'main', 'resources');
if (!fs.existsSync(appPropsDir)) {
    fs.mkdirSync(appPropsDir, { recursive: true });
}
const appPropsPath = path.join(appPropsDir, 'application.properties');
const appPropsContent = "server.port=8080\nspring.application.name=backend\njwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970\njwt.expiration=86400000\nspring.datasource.url=jdbc:mysql://localhost:3306/erp_system?createDatabaseIfNotExist=true\nspring.datasource.username=root\nspring.datasource.password=\nspring.jpa.hibernate.ddl-auto=update\nspring.jpa.show-sql=true\n";
fs.writeFileSync(appPropsPath, appPropsContent, 'utf8');
fs.writeFileSync(path.join(appPropsDir, 'application-dev.properties'), appPropsContent, 'utf8');
fs.writeFileSync(path.join(appPropsDir, 'application-prod.properties'), appPropsContent, 'utf8');

const testPropsDir = path.join(__dirname, 'src', 'test', 'resources');
if (!fs.existsSync(testPropsDir)) {
    fs.mkdirSync(testPropsDir, { recursive: true });
}
fs.writeFileSync(path.join(testPropsDir, 'application-test.properties'), appPropsContent, 'utf8');

const dirsToRemove = ['controller', 'service/impl', 'service', 'model', 'repository', 'dto/request', 'dto/response', 'dto', 'exception', 'utils'];
for (const d of dirsToRemove) {
    const full = path.join(srcRoot, 'com', 'erp', ...d.split('/'));
    if (fs.existsSync(full)) {
        try { fs.rmdirSync(full, { recursive: true }); } catch (e) {}
    }
}
