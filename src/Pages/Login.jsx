import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";

import Image from "../static/images/5765700.jpg";
import {
  APPLICATION_JSON,
  ERROR,
  FIELD_REQUIRED,
  LOGGED_IN,
  REFRESH_TOKEN,
  SUCCESS,
  TOKEN,
} from "../Utils/Constants";
import { useSnackbar } from "../Context/snackbar";
import { SetItem } from "../Utils/UtilFunctions";

const LoginGrid = styled(Grid)(() => ({
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const CustomPaper = styled(Paper)(() => ({
  margin: "2em 2em",
  padding: "1em 2em",
  height: "70%",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function Login() {
  const { setMsg } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname ?? "/";

  const initialBody = {
    username: "",
    password: "",
  };

  const [body, setBody] = useState(initialBody);
  const [formErrors, setFormErrors] = useState(initialBody);
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(TOKEN)) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBody({
      ...body,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!!!formErrors.username.length && !!!formErrors.password.length) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": APPLICATION_JSON },
          body: JSON.stringify(body),
        };
        const res = await fetch("/api/login", requestOptions);
        const data = await res.json();
        setValidation(false);
        if (res.status === 401) {
          setMsg(data.detail, ERROR);
        } else {
          setMsg(LOGGED_IN, SUCCESS);
          SetItem(TOKEN, data.access_token);
          SetItem(REFRESH_TOKEN, data.refresh_token);
          navigate(from, { replace: true });
        }
      }
    };
    if (validation) fetchData();
  }, [body, formErrors, navigate, setMsg, validation, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleValidation();
  };

  const handleValidation = () => {
    setFormErrors(initialBody);
    const errors = {
      username: "",
      password: "",
    };
    if (!!!body.username.length) errors.username = FIELD_REQUIRED;
    if (!!!body.password.length) errors.password = FIELD_REQUIRED;
    setFormErrors(errors);
    setValidation(true);
  };

  return (
    <Grid className="globalMaxHeight" container>
      <Grid className="globalMaxHeight" item md={6} style={{ height: "100%" }}>
        <img
          src={Image}
          className="globalMaxHeight"
          alt="Illustation"
          style={{ width: "100%" }}
        />
      </Grid>
      <LoginGrid item md={6}>
        <CustomPaper elevation={24}>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
              Login
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required={true}
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={body.username}
              onChange={handleChange}
              error={formErrors.username.length > 0}
              helperText={formErrors.username}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={body.password}
              onChange={handleChange}
              error={formErrors.password.length > 0}
              helperText={formErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: (theme) => theme.spacing(1) }}
            >
              Sign In
            </Button>
            <Divider sx={{ my: 2 }} />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button component={Link} to="/">
                Continue Browsing
              </Button>
              <Button component={Link} to="/register">
                Register
              </Button>
            </Stack>
          </form>
        </CustomPaper>
      </LoginGrid>
    </Grid>
  );
}
