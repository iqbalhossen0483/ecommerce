import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import useStore from "../components/context/useStore";
// import dynamic from "next/dynamic";
// const SocialLogin = dynamic(
//   () => import("../components/admin/socialLogin/SocialLogin"),
//   { ssr: false }
// );

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const emailRef = useRef(null);
  const router = useRouter();
  const store = useStore();

  function handleInput(e) {
    const name = e.target.name;
    setData((prev) => {
      return { ...prev, [name]: e.target.value };
    });
  }

  async function Login() {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        store.setUser(result.user);
        localStorage.setItem("token", result.token);
        router.push(store?.redirect);
      } else throw result;
    } catch (error) {
      setError(error.message);
    }
  }
  async function SingUp() {
    try {
      const res = await fetch("/api/login", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        store.setAlert({ msg: result.message, type: "success" });
      } else throw result;
    } catch (error) {
      setError(error.message);
    }
  }

  async function ForgotPassword() {
    const email = emailRef.current?.value;
    if (!email) return emailRef.current?.focus();
    setLoading(true);
    try {
      const res = await fetch(`/api/login?forgotPassword=${email}`);
      const result = await res.json();
      if (res.ok) {
        store.setAlert({
          msg: result.message,
          type: "info",
        });
      } else throw result;
    } catch (error) {
      store.setAlert({
        msg: error.message,
        type: "error",
      });
    }
    setLoading(false);
  }

  async function onSubmit(e) {
    setLoading(true);
    e.preventDefault();
    setError("");
    if (!login && data.password !== data.repassword) {
      setLoading(false);
      return setError("Check your password carefully");
    } else delete data.repassword;
    if (login) {
      await Login();
    } else {
      await SingUp();
    }
    setLoading(false);
  }

  return (
    <div className='bg-[#1D2939] min-h-screen relative'>
      <div className='login-container'>
        <form onSubmit={(e) => onSubmit(e)}>
          <div>
            <h3>
              <span>[</span> Eco Stay <span>]</span>
            </h3>
            <h4>{login ? "Sign In" : "Sign Up"}</h4>
          </div>
          <div className='space-y-4'>
            {!login && (
              <input
                onChange={(e) => handleInput(e)}
                name='name'
                required
                type='text'
                placeholder='Enter your name'
              />
            )}

            <input
              onChange={(e) => handleInput(e)}
              name='email'
              ref={emailRef}
              required
              type='email'
              placeholder='Enter your email'
            />
            <input
              onChange={(e) => handleInput(e)}
              name='password'
              min={6}
              required
              type='password'
              placeholder='Enter your password'
            />
            {!login && (
              <input
                onChange={(e) => handleInput(e)}
                name='repassword'
                required
                min={6}
                type='password'
                placeholder='Re type your password'
              />
            )}
            {login && (
              <button disabled={loading} onClick={ForgotPassword} type='button'>
                <p className='pl-3 text-blue-400'>Forgot Your Password?</p>
              </button>
            )}
          </div>
          <div>
            {error && <p className='text-red-400 mb-2'>{error}</p>}
            <button
              disabled={loading}
              type='submit'
              className='btn active w-full'
            >
              {loading ? "Loading..." : login ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>

        {/* <div>
          <p className='text-center my-5'>---------- Or ---------</p>
          <SocialLogin setError={setError} />
        </div> */}

        <div className='flex gap-2 justify-center mt-4 text-sm'>
          <p className='text-gray-600'>
            {login ? "Not yet a member" : "Already have a acount"}?
          </p>
          <button
            onClick={() => setLogin((prev) => !prev)}
            type='button'
            className='text-[#17A2B8]'
          >
            {loading ? "Loading..." : login ? " Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
