import { useSaleorAuthContext } from '@saleor/auth-sdk/react';
import Image from 'next/image';
import { type FormEvent, useState } from 'react';

type FormValues = {
  email: string;
  password: string;
}

const DefaultValues: FormValues = { email: '', password: '' }

export function LoginForm() {
  const { signIn } = useSaleorAuthContext();

  const [formValues, setFormValues] = useState<FormValues>(DefaultValues)
  const [errors, setErrors] = useState<string[]>([]);

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { data } = await signIn(formValues);

    if (data.tokenCreate.errors.length > 0) {
      setErrors(data.tokenCreate.errors.map((error) => error.message));
      setFormValues(DefaultValues);
    }
  }

  const changeHandler = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (errors.length > 0) setErrors([])
  }
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="my-10 flex justify-center">
        <Image src={`/saleor.png`} alt="Saleor" width={75} height={75} />
      </div>
      <form className="border shadow-md rounded p-8" onSubmit={submitHandler}>
        <div className="mb-2">
          <label className="sr-only" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded bg-gray-50 px-4 py-2 w-full"
            value={formValues.email}
            onChange={changeHandler}
          />
        </div>
        <div className="mb-4">
          <label className="sr-only" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border rounded bg-gray-50 px-4 py-2 w-full"
            value={formValues.password}
            onChange={changeHandler}
          />
        </div>

        <button className="bg-slate-800 text-slate-200 hover:bg-slate-700 rounded py-2 px-4" type="submit">
          Log In
        </button>
      </form>
      <div>
        {errors.map((error) => (
          <p key={error} className="text-red-500">
            {error}
          </p>
        ))}
      </div>
    </div>
  )
}