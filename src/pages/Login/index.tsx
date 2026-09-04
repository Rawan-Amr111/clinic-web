import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PlusSquareFilled,
} from "@ant-design/icons";
import classes from "./index.module.css";
import { supabase } from "../../lib/connect";

type FieldType = {
  username?: string;
  password?: string;
};

function Login() {
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!values.username || !values.password) return;

    const { data, error } = await supabase.functions.invoke("login", {
      body: {
        username: values.username,
        password: values.password,
      },
    });

    if (error) {
      console.error("Login failed:", error.message);
      return;
    }

    console.log("Login successful:", data);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
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
