"use client";

// React Imports
import { useState } from "react";

// Next Imports
import { useRouter, useSearchParams } from "next/navigation";

// MUI Imports
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";

// Third-party Imports
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, minLength, string, email, pipe, nonEmpty } from "valibot";
import type { SubmitHandler } from "react-hook-form";
import type { InferInput } from "valibot";
import classnames from "classnames";

// Type Imports
import LoadingButton from "@mui/lab/LoadingButton";

import { toast } from "react-toastify";

import type { Mode } from "@core/types";

// Component Imports
import Logo from "@components/layout/shared/Logo";

// Config Imports
import themeConfig from "@configs/themeConfig";

// Hook Imports
import { useImageVariant } from "@core/hooks/useImageVariant";
import { useSettings } from "@core/hooks/useSettings";

type ErrorType = {
  message: string[];
};

type FormData = InferInput<typeof schema>;

const schema = object({
  email: pipe(
    string(),
    minLength(1, "This field is required"),
    email("Please enter a valid email address"),
  ),
  password: pipe(
    string(),
    nonEmpty("This field is required"),
    minLength(5, "Password must be at least 5 characters long"),
  ),
});

const Login = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [errorState, setErrorState] = useState<ErrorType | null>(null);
  const [loading, setLoading] = useState(false);

  // Vars
  const darkImg = "/images/pages/auth-v2-mask-1-dark.png";
  const lightImg = "/images/pages/auth-v2-mask-1-light.png";
  const darkIllustration = "/images/illustrations/auth/v2-login-dark.png";
  const lightIllustration = "/images/illustrations/auth/v2-login-light.png";

  const borderedDarkIllustration =
    "/images/illustrations/auth/v2-login-dark-border.png";

  const borderedLightIllustration =
    "/images/illustrations/auth/v2-login-light-border.png";

  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useSettings();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const authBackground = useImageVariant(mode, lightImg, darkImg);

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration,
  );

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res && res.ok && res.error === null) {
        // Vars
        const redirectURL = searchParams.get("redirectTo") ?? "/";

        toast.success("Login successfully");
        router.replace(redirectURL);
      } else {
        if (res?.error) {
          const error = await JSON.parse(res.error);

          setErrorState(error);
        }
      }
    } catch (error) {
      toast.error("Wrong email or password");
    }

    setLoading(false);
  };

  return (
    <div className="flex bs-full justify-center">
      <div
        className={classnames(
          "flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden",
          {
            "border-ie": settings.skin === "bordered",
          },
        )}
      >
        <div className="pli-6 max-lg:mbs-40 lg:mbe-24">
          <img
            src={characterIllustration}
            alt="character-illustration"
            className="max-bs-[673px] max-is-full bs-auto"
          />
        </div>
        <img
          src={authBackground}
          className="absolute bottom-[4%] z-[-1] is-full max-md:hidden"
        />
      </div>
      <div className="flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]">
        <div className="absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]">
          <Logo />
        </div>
        <div className="flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]">
          <div>
            <Typography variant="h4">{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
            <Typography>
              Please sign-in to your account and start the adventure
            </Typography>
          </div>
          <Alert
            icon={false}
            className="bg-[var(--mui-palette-primary-lightOpacity)]"
          >
            <Typography variant="body2" color="primary">
              Email: <span className="font-medium">admin@senvest.com</span> /
              Pass: <span className="font-medium">admin</span>
            </Typography>
          </Alert>

          <form
            noValidate
            action={() => {}}
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  type="email"
                  label="Email"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    errorState !== null && setErrorState(null);
                  }}
                  {...((errors.email || errorState !== null) && {
                    error: true,
                    helperText:
                      errors?.email?.message || errorState?.message[0],
                  })}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  id="login-password"
                  type={isPasswordShown ? "text" : "password"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    errorState !== null && setErrorState(null);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={(e) => e.preventDefault()}
                          aria-label="toggle password visibility"
                        >
                          <i
                            className={
                              isPasswordShown
                                ? "ri-eye-off-line"
                                : "ri-eye-line"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...(errors.password && {
                    error: true,
                    helperText: errors.password.message,
                  })}
                />
              )}
            />
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              fullWidth
              variant="contained"
              type="submit"
            >
              Log In
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
