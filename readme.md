# Vote-Karo - A voting App

Vote-Karo is a node.js application that allows users to participate in voting by casting votes for a set of candidates. The app ensures secure authentication, voting restrictions, and live vote counts. Admins have special privileges to manage the candidate list.

## Features

### User Functionality
1. **Sign Up / Sign In**: Users can create accounts and log in using their unique Aadhar Card Number and password.
2. **View Candidates**: Users can view the list of candidates available for voting.
3. **Cast Votes**: Users can vote for one candidate. Once voted, they cannot vote again.
4. **Live Vote Count**: A route displays the list of candidates along with their current vote counts, sorted by votes.
5. **Update Password**: Users can change their password if needed.

### Admin Functionality
1. **Manage Candidates**: Admins can create, update, and delete candidates.
2. **No Voting Privileges**: Admins cannot vote.

### Data Integrity
- Each user must provide a unique Aadhar Card Number for account creation.
- Voting is restricted to one vote per user.

---

## Routes

### User Authentication
| Endpoint        | Method | Description                              |
|-----------------|--------|------------------------------------------|
| `/signup`       | POST   | Create a new user account                |
| `/login`        | POST   | Log into an existing account             |

### Voting
| Endpoint          | Method | Description                              |
|-------------------|--------|------------------------------------------|
| `/candidate/candidates`     | GET    | Retrieve the list of candidates          |
| `/vote/:candidateId` | POST | Vote for a specific candidate            |

### Vote Counts
| Endpoint         | Method | Description                              |
|------------------|--------|------------------------------------------|
| `/vote/counts`   | GET    | Retrieve candidates with live vote counts sorted by votes |

### User Profile
| Endpoint               | Method | Description                              |
|------------------------|--------|------------------------------------------|
| `/profile`             | GET    | Retrieve the user's profile information |
| `/profile/password`    | PUT    | Update the user's password              |

### Admin Candidate Management
| Endpoint                   | Method | Description                              |
|----------------------------|--------|------------------------------------------|
| `/candidates`              | POST   | Add a new candidate                      |
| `/candidate/:candidateId` | PUT    | Update an existing candidate             |
| `/candidate/:candidateId`  | DELETE | Remove a candidate from the list         |

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd VoteKaroApp
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables in a `.env` file:
   ```env
   PORT=3000
   MONGO_URI=<your mongo url>
   JWT_SECRET=<your_secret_key>
   ```

5. Start the server:
   ```bash
   npm start
   ```

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Mongoose Validation

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.