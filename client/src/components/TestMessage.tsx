import { useEffect, useState } from "react";

export default function Message() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      const res = await fetch("http://localhost:5001/api/hello");
      const data = await res.json();
      setMessage(data.message);
      setLoading(false);
    };

    fetchMessage();
  }, []);

  if (loading) return <p>Loading...</p>;

  return <h1>{message}</h1>;
}
