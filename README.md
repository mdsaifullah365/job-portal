# Job Portal Server

## Server [https://jobportal24.herokuapp.com/](https://jobportal24.herokuapp.com/).

## Credentials

### Admin:

- email: "admin@gmail.com"
- password: "Admin123#"

### Manager:

- email: "hiringmanager@gmail.com"
- password: "Manager123#"

### Candidate:

- email: "mdsaifullah.wd@gmail.com"
- password: "Saif123#"

## Data Schema

### Create Job

- title: String, required
- description: String, required
- deadline: Date, required
- companyName: String, required
- jobType: ['full-time', 'part-time', 'internship', 'contract'], required
- position:String, required
- salary: Number, required
- location: String, required

### Apply Job

- resume: FormData,
- coverLetter: String, Optional

### Sign up

- email: String, required
- password: String, required
- confirmPassword: String, required
- role: ['candidate', 'hiring-manager', 'admin'], default: 'candidate',
- firstName: String, required
- lastName: String, required
- contactNumber: String, Optional
- imageURL: String, Optional
