import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [fetchCompanies, setFetchCompanies] = useState([]);
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const remember = 3600;

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    if (cookies["user"]) {
      navigate("/Companies"); // Navigate to the correct path
    }
    axios
      .get("http://localhost:3001/getCompanies")
      .then((res) => setFetchCompanies(res.data))
      .catch((err) => console.log(err));
  }, [cookies, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        user: idNumber,
        password: password,
      });

      const cookieData = {
        AccountType: response.data.user.AccountType,
        Department: response.data.user.Department,
        EmployeeID: response.data.user.EmployeeID,
        JobTitle: response.data.user.JobTitle,
        Name: response.data.user.Name,
        message: response.data.message,
        loginTime: new Date().toISOString(),
      };

      setCookie("user", cookieData, {
        path: "/",
        ...(isChecked ? {} : { maxAge: remember }),
      });

      navigate("/Companies");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials");
    }
  };
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-t from-[#ed1c24] to-[#ed1c24]/60">
      <div className="w-2/3 md:w-2/3 lg:1/3 max-w-md h-auto flex flex-col justify-center items-center rounded-lg shadow-lg p-6 bg-white">
        <div className="flex min-h-full flex-1 flex-col justify-center lg:py-12 py-5 lg:px-8">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex flex-wrap justify-center items-center gap-5">
              {fetchCompanies.map((company) => (
                <img
                  key={company.company_id}
                  className="lg:h-15 h-10 w-auto"
                  src={company.logo_address}
                  alt={`${company.CompanyName} Logo`}
                />
              ))}
            </div>
            <h2 className="mt-10 text-center text-xl font-bold tracking-tight text-gray-900">
              Item Build Up Form
            </h2>
          </div>

          <div className="mt-10 mx-auto w-full max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="id_number"
                  className="block text-sm font-medium text-gray-900"
                >
                  ID Number
                </label>
                <div className="mt-2">
                  <input
                    id="id_number"
                    name="id_number"
                    type="number"
                    required
                    value={idNumber}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 6);
                      setIdNumber(value);
                    }}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">
                      Remember me
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a user? Ask{" "}
              <span className="font-bold text-black">IT Department</span> to
              create an account for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
