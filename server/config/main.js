module.exports = {
  // Secret key for JWT signing and encryption
  secret: 'super secret passphrase',
  
  // Database connection information
  db_url: 'mongodb://localhost:27017/cjbsingi',
  db_options: {
    user: 'chonjibong',
    pass: ''
  },
  db_collection_prefix: 'cjb_',

  // Admin default username and password
  admin: {
    userID: 'admin',
    password: '123456',
    realName: '체계관리자',
    birthday: '1980-01-01'
  },

  // CORS setting
  allowed_origin: ['http://localhost:5000', 'http://localhost:4200','http://localhost:3000','http://localhost:5001', 'http://localhost:8081'],

  // Setting port for server
  expiresIn: 360000, // 100 hr
  port: 5005,
  test_port: 3001,
  test_db: 'mern-starter-test',
  test_env: 'test',

  // file upload path
  upload: '/upload',
  upload_photo: '/photo',
  upload_attachment: '/attachment',
  upload_public: '/public',

  // log 
  logpath: '/logs',
  
  //laguage setting
  lang: 'kp',

  //reset password
  reset_password: '123456',
  serviceUrl: process.env.REACT_APP_SERVICE_URL || 'http://localhost:3001',
};
