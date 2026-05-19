'use client';

import { useState } from 'react';

export default function PasswordModal({
  title,
  buttonText,
  onSubmit,
  onClose,
}: {
  title: string;

  buttonText: string;

  onSubmit: (
    password: string
  ) => Promise<void>;

  onClose: () => void;
}) {

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  return (
    <div
      className="
        bg-white
        rounded-2xl
        w-full
        max-w-3xl
        p-6
        shadow-xl
      "
    >

      <h2 className="text-xl font-semibold mb-4">
        {title}
      </h2>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="
          w-full
          border
          border-zinc-300
          rounded-xl
          px-3
          py-2
          outline-none
          mb-4
          focus:border-black
          transition
        "
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={onClose}
          className="
            px-4
            py-2
            rounded-lg
            border
          "
        >
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={async () => {

            if (!password.trim()) {
              return;
            }

            try {

              setLoading(true);

              await onSubmit(password);

            } finally {

              setLoading(false);
            }
          }}
          className="
            bg-black
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          {buttonText}
        </button>

      </div>
    </div>
  );
}