import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PlusSquareFilled,
} from "@ant-design/icons";
import classes from "./index.module.css";
import { supabase } from "../../lib/connect";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
type FieldType = {
  username?: string;
  password?: string;
};

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!values.username || !values.password) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("login", {
        body: {
          username: values.username,
          password: values.password,
        },
      });

      if (error || !data?.session) {
        message.error("Invalid username or password.");
        return;
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      if (sessionError) {
        message.error("Unable to start your session. Please try again.");
        return;
      }

      message.success("Login successful.");
      navigate("/dashboard");
    } catch {
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () => {
    message.error("Please enter your username and password.");
  };

  return (
    <div className={classes["login-container"]}>
      <div className={classes["image-section"]}></div>

      <div className={classes["form-section"]}>
        <div className={classes["form-wrapper"]}>
          <div className={classes["brand-header"]}>
            <PlusSquareFilled style={{ fontSize: "28px", color: "#0052cc" }} />
            <span>ClinicFlow</span>
          </div>

          <h2 className={classes["title"]}>Welcome back</h2>
          <p className={classes["subtitle"]}>
            Please enter your credentials to access your dashboard.
          </p>

          <Form
            form={form}
            size="large"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item<FieldType>
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                placeholder="admin"
                prefix={<UserOutlined style={{ color: "#a5adba" }} />}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label={
                <div className={classes["password-label-container"]}>
                  <span>Password</span>
                  <a href="#forgot" className={classes["forgot-password"]}>
                    Forgot password?
                  </a>
                </div>
              }
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="••••••••"
                prefix={<LockOutlined style={{ color: "#a5adba" }} />}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className={classes["submit-btn"]}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className={classes["footer-text"]}>
            Having trouble? <a href="#support">Contact IT Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
