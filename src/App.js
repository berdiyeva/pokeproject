import React, { useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link,
} from "react-router-dom";
import Cookies from "js-cookie";
import Pokemon from './Pokemon';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

const AuthApi = React.createContext();
const TokenApi = React.createContext();


function App() {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState("");
  const readCookie = () => {
    let token = Cookies.get("token");
    if (token) {
      setAuth(true);
      setToken(token);
    }
  };
  React.useEffect(() => {
    readCookie();
  }, []);

  return (
    <div className="App">
      <AuthApi.Provider value={{ auth, setAuth }}>
        <TokenApi.Provider value={{ token, setToken }}>
          <Router>
            <div>
              <nav>
                <ul className="nav justify-content-evenly align-items-center">
                  {!auth ? (
                    <li className="nav-item">
                      <Link to="/register" className="text-decoration-none fs-5 link-info">Regsiter</Link>
                    </li>
                  ) : (
                    <></>
                  )}
                  {!auth ? (
                    <li>
                      <Link to="/login" className="text-decoration-none fs-5 link-info">Login</Link>
                    </li>
                  ) : (
                    <></>
                  )}
                  <li>
                    <Link to="/" className="text-decoration-none fs-5">Home</Link>  
                  </li>
                  <li><Link to="/pokemons" className="text-decoration-none fs-7 text-muted"> <img src="https://img.icons8.com/color/48/000000/pokeball-2.png"/>
                    See Pokemons Anyway!</Link> </li>
                </ul>
              </nav>
              <Routes />
            </div>
          </Router>
        </TokenApi.Provider>
      </AuthApi.Provider>
      
    </div>
  );
}

const Routes = () => {
  const Auth = React.useContext(AuthApi);
  return (
    <Switch>
      <Route path="/pokemons">
        <Pokemon />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <ProtectedLogin
        path="/login"
        auth={Auth.auth}
        component={Login}
      ></ProtectedLogin>
      <ProtectedRoute
        path="/"
        auth={Auth.auth}
        component={Home}
      ></ProtectedRoute>

    </Switch>
  );
};

const Home = () => {
  const [data, setData] = useState("");
  const Auth = React.useContext(AuthApi);
  const Token = React.useContext(TokenApi);
  const handleonclick = () => {
    Auth.setAuth(false);
    Cookies.remove("token");
  };
  let toke = Token.token;
  const headers = {
    Authorization: `Bearer ${toke}`,
  };
  const getdata = async () => {
    let res = await axios
      .get("http://127.0.0.1:8000/", { headers })
      .then((response) => {
        return response.data.data;
      });
    return res;
  };
  React.useEffect(async () => {
    let x = await getdata();
    setData(x);
    console.log(x);
  }, []);
  return (
    <>
      <h2>Home</h2>
      <button onClick={handleonclick}>Logout</button>
      <h1>{data}</h1>
      <Pokemon/>
    </>
  );
};

function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const data = {
      username: name,
      password: password,
    };
    axios
      .post("http://127.0.0.1:8000/create", data)
      .then((response) => {
        console.log(response);
        alert(response);
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <div className="container pt-5 my-5 text-white mx-auto" style={{maxWidth: "fit-content"}}>
      <form
        onSubmit={handleSubmit}
      >
        <div style={{ textAlign: "center" }} className="fs-3">Register</div>
        <div className="mb-3">
        <label className="form-label">Username:</label>
        <input
          type="text"
          className="username form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        </div>
        <div className="mb-3">
        <label className="form-label">Password: </label>
        <input
          type="password"
          className="password form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        </div>
        <div style={{ textAlign: "center" }} className="card_item">
          <input className="btn btn-primary active" type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}

const Login = () => {
  const Auth = React.useContext(AuthApi);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    const data = {
      username: name,
      password: password,
    };
    const news = async () => {
      let res = await axios
        .post("http://127.0.0.1:8000/login", data)
        .then((response) => {
          console.log(response);
          Cookies.set("token", response.data.access_token);
          return response;
        })
        .catch((error) => {
          console.log(error.message);
        });
      return res;
    };
    let x = await news();
    if (x) {
      window.location.reload();
    }
  };
  return (
    <div className="container pt-5 my-5 text-white mx-auto" style={{maxWidth: "fit-content"}}>
      <form
        onSubmit={handleSubmit}
      >
        <div style={{ textAlign: "center"}} className="fs-3">Login</div>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="username form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label">Password: </label>
          <input
            type="password"
            className="password form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div style={{ textAlign: "center" }} className="card_item">
          <input className="btn btn-primary active" type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

const ProtectedRoute = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (auth ? <Component /> : <Redirect to="/login" />)}
    />
  );
};
const ProtectedLogin = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (!auth ? <Component /> : <Redirect to="/" />)}
    />
  );
};
export default App;
