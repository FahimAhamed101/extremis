"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/lib/services/authApi";
import { extractApiErrorMessage } from "@/lib/utils/extractApiErrorMessage";

export default function SignupForm() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const [status, setStatus] = useState<{ text: string; error: boolean }>({
    text: "",
    error: false,
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      firstName: String(formData.get("firstName") || "").trim(),
      lastName: String(formData.get("lastName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
      researcherType: String(formData.get("researcherType") || "").trim(),
      institute: String(formData.get("institute") || "").trim(),
      department: String(formData.get("department") || "").trim(),
      position: String(formData.get("position") || "").trim(),
      gender: String(formData.get("gender") || "").trim(),
      termsAccepted: formData.get("termsAccepted") === "on",
    };

    try {
      await signup(payload).unwrap();
      setStatus({ text: "Account created successfully. Redirecting to login...", error: false });
      form.reset();
      setTimeout(() => {
        router.push("/login");
      }, 1100);
    } catch (error) {
      setStatus({ text: extractApiErrorMessage(error, "Signup failed."), error: true });
    }
  };

  return (
    <form method="post" className="c-form" onSubmit={onSubmit}>
      <div className="row merged-10">
        <div className="col-lg-12">
          <h4>What type of researcher are you?</h4>
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6">
          <input type="text" name="firstName" placeholder="First Name" required />
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6">
          <input type="text" name="lastName" placeholder="Last Name" required />
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6">
          <input type="email" name="email" placeholder="Email@" required />
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6">
          <input type="password" name="password" placeholder="Password" minLength={6} required />
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6">
          <input type="radio" id="student" name="researcherType" value="student" />
          <label htmlFor="student">Academic Or Student</label>
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6">
          <input type="radio" id="ngo" name="researcherType" value="ngo" />
          <label htmlFor="ngo">Corporate, Govt, Or NGO Person</label>
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6">
          <input type="radio" id="medical" name="researcherType" value="medical" />
          <label htmlFor="medical">Medical</label>
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6">
          <input type="radio" id="other" name="researcherType" value="other" />
          <label htmlFor="other">Not a Rsearcher</label>
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6">
          <input type="text" name="institute" placeholder="Institute, Company" />
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6">
          <input type="text" name="department" placeholder="Department" />
        </div>
        <div className="col-lg-12">
          <input type="text" name="position" placeholder="Your Position" />
        </div>
        <div className="col-lg-12">
          <div className="gender">
            <input type="radio" id="male" name="gender" value="male" />
            <label htmlFor="male">Male</label>
            <input type="radio" id="female" name="gender" value="female" />
            <label htmlFor="female">Female</label>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="checkbox">
            <input type="checkbox" id="terms" name="termsAccepted" defaultChecked />
            <label htmlFor="terms">
              <span>I agree the terms of Services and acknowledge the privacy policy</span>
            </label>
          </div>
          <button className="main-btn" type="submit" disabled={isLoading}>
            <i className="icofont-key"></i> {isLoading ? "Signing up..." : "Signup"}
          </button>
          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: status.error ? "#d42626" : "#1a8f4d",
            }}
          >
            {status.text}
          </p>
        </div>
      </div>
    </form>
  );
}
