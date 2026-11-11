
import { useEffect, useState } from "react";
import API_URL from "./api";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [readings, setReadings] = useState([]);
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [slot, setSlot] = useState("Morning");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

const [reportType, setReportType] = useState("daily");
const [report, setReport] = useState(null);
const [reportDate, setReportDate] = useState(
  new Date().toLocaleDateString("en-CA")
);


  async function loadReadings() {
    try {
      const response = await fetch(`${API_URL}/readings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setReadings(data);
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Could not load readings.");
    }
  }


async function loadReport() {
  try {
    const response = await fetch(
      `${API_URL}/reports/${reportType}?date=${reportDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("REPORT RESPONSE:", response.status, data);
    if (response.ok) {
      setReport(data);
      setMessage("");
    } else {
      setMessage(data.message || "Could not load report.");
    }
  } catch {
    setMessage("Could not connect to the report server.");
  }
}

  useEffect(() => {
    if (token) loadReadings();
  }, [token]);
  
  useEffect(() => {
  if (token) loadReport();
}, [token, reportType, reportDate]);

  async function addReading(e) {
    e.preventDefault();
    setMessage("");


    try {
      const response = await fetch(`${API_URL}/readings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          time_slot: slot,
          value: Number(value),
        }),
      });

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setValue("");
        loadReadings();
      }
    } catch {
      setMessage("Could not add reading.");
    }
  }


async function editReading(reading) {
  const newValue = window.prompt(
    "Enter the updated glucose value:",
    reading.value
  );

  if (newValue === null) return;

  const response = await fetch(`${API_URL}/readings/${reading.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      date: String(reading.reading_date).slice(0, 10),
      time_slot: reading.time_slot,
      value: Number(newValue),
    }),
  });

  const data = await response.json();
  setMessage(data.message);

  if (response.ok) loadReadings();
}


  async function deleteReading(id) {
    if (!window.confirm("Delete this reading?")) return;

    const response = await fetch(`${API_URL}/readings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) loadReadings();
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setReadings([]);
  }

  if (token) {
    return (
      <div className="app">
        <header>
          <h1>💗 Sweety</h1>
          <p>Blood Glucose Tracker</p>
          <button onClick={logout}>Logout</button>
        </header>

        <main>
          <h2>Welcome, {user?.name || "User"}!</h2>
          <p>Manage your daily glucose readings.</p>

          <div className="welcome-card">
            <h3>Add Glucose Reading</h3>

            <form onSubmit={addReading}>
              <label>Date</label>
              <input
                type="date"
                value={date}
                max={new Date().toLocaleDateString("en-CA")}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <label>Time Slot</label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
              >
                <option>Morning</option>
                <option>After breakfast</option>
                <option>After lunch</option>
                <option>After dinner</option>
              </select>

              <label>Glucose Value (mg/dl)</label>
              <input
                type="number"
                min="40"
                max="600"
                placeholder="Enter glucose value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />

              <button type="submit">Add Reading</button>
            </form>

            <p>{message}</p>
          </div>

          <div className="welcome-card">
            <h3>Your Glucose Readings</h3>

            {readings.length === 0 ? (
              <p>No readings available yet.</p>
            ) : (
              readings.map((reading) => (
                <div key={reading.id}>
                  <p>
                    <strong>{reading.reading_date}</strong>
                    {" - "}{reading.time_slot}
                    {" - "}{reading.value} mg/dl
                  </p>
                  
<button onClick={() => editReading(reading)}>
  Edit
</button>

<button onClick={() => deleteReading(reading.id)}>
  Delete
</button>

                </div>
              ))
            )}
          </div>

<div className="welcome-card">
  <h3>📊 Glucose Reports</h3>

  <label>Report Type</label>
  <select
    value={reportType}
    onChange={(e) => setReportType(e.target.value)}
  >
    <option value="daily">Daily Report</option>
    <option value="month-to-date">Month-to-Date Report</option>
    <option value="previous-month">Previous Month Report</option>
  </select>

  <label>Select Date</label>
  <input
    type="date"
    value={reportDate}
    max={new Date().toLocaleDateString("en-CA")}
    onChange={(e) => setReportDate(e.target.value)}
  />

 
{report && (
  <div>
    <p>Total Readings: {report.summary?.count ?? 0}</p>
    <p>Highest: {report.summary?.highest ?? "N/A"} mg/dl</p>
    <p>Lowest: {report.summary?.lowest ?? "N/A"} mg/dl</p>
    <p>Average: {report.summary?.average ?? "N/A"} mg/dl</p>

    {reportType === "daily" && (
      <>
        <h4>Daily Reading Details</h4>
        {report.readings?.length ? (
          report.readings.map((item) => (
            <p key={item.id}>
              {item.time_slot}: {item.value} mg/dl
            </p>
          ))
        ) : (
          <p>No readings for this date.</p>
        )}
      </>
    )}
  </div>
)}

</div>

        </main>
      </div>
    );
  }

  return (
    <AuthPage
      onLogin={(data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      }}
    />
  );
}

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("Please wait...");

    try {
      const endpoint = isLogin ? "login" : "register";

      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin ? { email, password } : { name, email, password }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      if (isLogin) {
        onLogin(data);
      } else {
        setMessage("Registration successful! Please log in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch {
      setMessage("Cannot connect to server.");
    }
  }

  return (
    <div className="app">
      <header>
        <h1>💗 Sweety</h1>
        <p>Blood Glucose Tracker</p>
      </header>

      <main>
        <h2>Welcome to Sweety!</h2>
        <p>Track your daily blood glucose readings easily.</p>

        <div className="welcome-card">
          <h3>{isLogin ? "Login to Your Account" : "Create an Account"}</h3>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <button type="submit">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p>{message}</p>

          <p>
            {isLogin ? "New user?" : "Already registered?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
            >
              {isLogin ? " Sign Up" : " Login"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
