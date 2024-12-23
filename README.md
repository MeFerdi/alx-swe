# GROUPIE TRACKER
![](static/images/search-searching-internet-finding-seeking-quest-concept(1).jpg)
Groupie-Tracker consists of creating a functional program that searches, and displays artists and their respective musical bands using the music API

## Features
* The program should handle at least these search cases:
    - artist/band name
    - members
    - locations
    - first album date
    - creation date
- The program must handle search input as case-insensitive.

## API Structure
The API consists of four parts:
* **Artists**: Contains information about some bands and artists including:
   * Name(s)
   * Image
   * In which year they began their activity
   * Date of their first album
   * Members.
* **Locations**: Consists of their last and/or upcoming concert locations.
* **Dates**: Consists of their last and/or upcoming concert dates.
* **Relation**: Links all the other parts, artists, dates, and locations.

## CI/CD Integration

Continuous Integration (CI) and Continuous Deployment (CD) are essential practices for modern software development, allowing for rapid delivery of high-quality software. 

### What is CI/CD?
- **Continuous Integration (CI)**: This practice involves automatically integrating code changes from multiple contributors into a shared repository several times a day. Each integration is verified by an automated build and tests to detect errors quickly.
  
- **Continuous Deployment (CD)**: This extends CI by automatically deploying all code changes to production after passing predefined tests. This ensures that new features and fixes are delivered to users quickly and reliably.

### How CI/CD Works in This Project:
1. **Version Control**: Code changes are committed to the GitHub repository.
2. **Automated Builds**: Jenkins is configured to trigger builds automatically upon code changes. This includes compiling the code and running tests.
3. **Testing**: Automated tests ensure that new changes do not break existing functionality. If tests fail, the build process halts, allowing developers to address issues immediately.
4. **Deployment**: Once the build passes all tests, the application is automatically deployed to Vercel(!!UNDER DEVELOPMENT), ensuring that the latest version is always available to users.

### Benefits of CI/CD:
- **Faster Release Cycle**: Automating the integration and deployment processes allows for quicker releases.
- **Improved Code Quality**: Continuous testing helps identify bugs early in the development process.
- **Reduced Manual Errors**: Automation minimizes human intervention, leading to more consistent deployments.

## Tools Used

- **Programming Language**: Go (Golang)
- **Frontend Technologies**: HTML/CSS, JavaScript
- **Containerization**: Docker
- **Continuous Integration/Deployment**: Jenkins
- **Version Control**: GitHub

## How to Run Using Docker

To run the project using Docker, follow these steps:

1. **Clone the Repository**:
```bash
git clone https://github.com/MeFerdi/alx-swe.git
```

2. **Navigate to the Project Directory**:
cd groupie-tracker-search-bar
text


3. **Build the Docker Image**:
Run the following command in your terminal to build the Docker image:
***docker build -t groupie-tracker .***
text

4. **Run the Docker Container**:
Execute this command to run your application inside a Docker container:
docker run -p 3000:3000 groupie-tracker
text

5. **Access the Website**:
Open your web browser and navigate to `http://localhost:3000` to access your application.

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

## Contact Information

For any questions or inquiries, feel free to reach out:
- Email: apikojuma94@gmail.com

## Contribution
* If you want to contribute to this project, feel free to open issues or pull requests. Any improvements, bug fixes, or features are welcome!

## Contributors

[Ferdynand Odhiambo](https://github.com/MeFerdi)