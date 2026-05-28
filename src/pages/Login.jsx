import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail, Wrench } from "lucide-react";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl bg-cyan-600 text-white">
            <Wrench className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">SmartHub</h1>
          <p className="text-sm text-slate-500">Service Provider Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input icon={<Mail />} type="email" value={email} setValue={setEmail} placeholder="Email" />
          <Input icon={<Lock />} type="password" value={password} setValue={setPassword} placeholder="Password" />

          <button className="w-full rounded-lg bg-cyan-600 py-2.5 font-semibold text-white hover:bg-cyan-700">
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          No account?{" "}
          <Link to="/register" className="font-semibold text-cyan-700">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

function Input({ icon, type = "text", value, setValue, placeholder }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
      {icon && <span className="text-slate-400 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      <input
        type={type}
        className="w-full outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
    </div>
  );
}