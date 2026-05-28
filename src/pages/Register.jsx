import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Mail, Lock, User, Wrench } from "lucide-react";
import { auth, db } from "../firebase";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "serviceProviders", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        service,
        phone,
        city,
        email,
        role: "service-provider",
        status: "Pending",
        createdAt: new Date().toISOString()
      });

      alert("Account created and saved in Firestore");
      navigate("/");
    } catch (error) {
  console.log("Firebase error code:", error.code);
  console.log("Firebase error message:", error.message);
  alert(error.code + " - " + error.message);
}
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl bg-cyan-600 text-white">
            <Wrench className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-slate-500">Service Provider Registration</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input icon={<User />} value={name} setValue={setName} placeholder="Full name" />
          <Input icon={<Wrench />} value={service} setValue={setService} placeholder="Service type" />
          <Input value={phone} setValue={setPhone} placeholder="Phone number" />
          <Input value={city} setValue={setCity} placeholder="City" />
          <Input icon={<Mail />} type="email" value={email} setValue={setEmail} placeholder="Email" />
          <Input icon={<Lock />} type="password" value={password} setValue={setPassword} placeholder="Password" />

          <button className="w-full rounded-lg bg-cyan-600 py-2.5 font-semibold text-white hover:bg-cyan-700">
            Register
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-cyan-700">
            Login
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