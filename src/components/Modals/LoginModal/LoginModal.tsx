import { observer } from "mobx-react";
import { FormikValues, useFormik } from "formik";
import { Modal } from "../Modal/Modal";
import { useStores } from "../../../utils/use-stores-hook";
import { Button } from "../../ui/Button/Button";
import { LoginWithCodeModal } from "../LoginReceiveCodeModal/LoginWithCodeModal";
import { LoginForPartnersModal } from "../ForPartnersModal/LoginForPartnersModal";
import styles from "../Modal/Modal.module.scss";
import { SignUpModal } from "../SignUpModal/SignUpModal";
import * as Yup from "yup";
import axios from "axios";

export const LoginModal = observer(() => {
  const { modalStore: { clearCurrentModal, setCurrentModal } } = useStores();

  const onLoginClick = (values: FormikValues) => {
    axios.post("login", {
      login: values.login,
      password: values.password
    })
      .then((res: any) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data))
        clearCurrentModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onLoginWithCodeClick = () => {
    setCurrentModal(LoginWithCodeModal);
  };

  const onSignUpClick = () => {
    setCurrentModal(SignUpModal);
  };

  const onPartnerButtonClick = () => {
    setCurrentModal(LoginForPartnersModal);
  };

  const formik = useFormik({
    initialValues: {
      login: "",
      password: ""
    },
    validationSchema: Yup.object().shape({
      login: Yup.string()
        .required("Введите почту"),
        // .email("Введите действительную почту"),
      password: Yup.string()
        .required("Введите пароль")
        .matches(/^(?=.*[0-9])(?=.*[a-z]).{3,10}$/g,
          "Пароль должен содержать строчные латинские  буквы, а также цифру")
        .min(3, "Минимальная длина пароля 3 символа"),
    }),
    onSubmit: (values) => {
      onLoginClick(values);
    }
  });

  return (
    <Modal title="Вход" onClose={clearCurrentModal}>
      <form onSubmit={formik.handleSubmit} className={styles.modal_container}>
        <input
          type="text"
          name="login"
          placeholder="login"
          value={formik.values.login}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.login && formik.touched.login ? (
          <div className={styles.modal_container__error}>{formik.errors.login}</div>
        ) : null}

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.password && formik.touched.password ? (
          <div className={styles.modal_container__error}>{formik.errors.password}</div>
        ) : null}

        <Button
          type="submit"
          theme={"green"}
          children={"Войти"}
        />
        <div className={styles.modal_container__row}>
          <Button
            type="button"
            onClick={onLoginWithCodeClick}
            theme={""}
            color={"#07C88E"}
            children={"Войти с помощью смс"}
          />

          <Button
            type="button"
            onClick={onSignUpClick}
            theme={""}
            color={"#07C88E"}
            children={"Регистрация"}
          />
        </div>

        <Button
          type="button"
          onClick={onPartnerButtonClick}
          theme={"grey"}
          children={"Вход для партнеров"}
        />
      </form>
    </Modal>
  );
});