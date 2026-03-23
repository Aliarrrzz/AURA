import app from "./app";
import transporter from "./config/mail";

transporter.verify().then(() => {
  console.log("✅ Email transporter ready");
}).catch(err => {
  console.error("❌ Email transporter verify failed:", err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅Server running on port ${PORT}`);
});