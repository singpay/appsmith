import classNames from "classnames";
import React, { forwardRef } from "react";
import {
  Button as HeadlessButton,
  Icon as HeadlessIcon,
} from "@design-system/headless";
import { useVisuallyHidden } from "@react-aria/visually-hidden";
import { Text } from "../../Text";
import { Spinner } from "../../Spinner";
import styles from "./styles.module.css";
import { getTypographyClassName } from "@design-system/theming";

import type { ButtonRef as HeadlessButtonRef } from "@design-system/headless";
import type { ButtonProps } from "./types";

const _Button = (props: ButtonProps, ref: HeadlessButtonRef) => {
  props = useVisuallyDisabled(props);
  const {
    children,
    color = "accent",
    icon: Icon,
    iconPosition = "start",
    isLoading,
    loadingText = "Loading...",
    // eslint-disable-next-line -- TODO add onKeyUp when the bug is fixed https://github.com/adobe/react-spectrum/issues/4350
    onKeyUp,
    variant = "filled",
    visuallyDisabled,
    ...rest
  } = props;
  const { visuallyHiddenProps } = useVisuallyHidden();

  const renderChildren = () => {
    return (
      <>
        <span aria-hidden={isLoading ? true : undefined} data-content="">
          {Icon && (
            <HeadlessIcon>
              <Icon />
            </HeadlessIcon>
          )}
          {children && (
            <Text fontWeight={600} lineClamp={1} textAlign="center">
              {children}
            </Text>
          )}
        </span>

        <span aria-hidden={!isLoading ? true : undefined} data-loader="">
          <Spinner />
          <span {...visuallyHiddenProps}>{loadingText}</span>
        </span>
      </>
    );
  };

  return (
    <HeadlessButton
      aria-busy={isLoading ? true : undefined}
      aria-disabled={
        visuallyDisabled || isLoading || props.isDisabled ? true : undefined
      }
      className={classNames(styles.button, getTypographyClassName("body"))}
      data-button=""
      data-color={color}
      data-icon-position={iconPosition === "start" ? "start" : "end"}
      data-loading={isLoading ? "" : undefined}
      data-variant={variant}
      draggable
      ref={ref}
      {...rest}
    >
      {renderChildren()}
      <span aria-hidden="true" className={styles.dragContainer} />
    </HeadlessButton>
  );
};

export const Button = forwardRef(_Button);

/**
 * This hook is used to disable all click/press events on a button
 * when the button is visually disabled
 */
const useVisuallyDisabled = (props: ButtonProps) => {
  let computedProps = props;

  if (props.visuallyDisabled || props.isLoading) {
    computedProps = {
      ...props,
      isDisabled: false,
      // disabling click/press events
      onPress: undefined,
      onPressStart: undefined,
      onPressEnd: undefined,
      onPressChange: undefined,
      onPressUp: undefined,
      onKeyDown: undefined,
      onKeyUp: undefined,
    };
  }

  return computedProps;
};
