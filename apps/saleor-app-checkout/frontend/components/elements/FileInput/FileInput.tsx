import { Typography } from "@material-ui/core";
import { Button, DeleteIcon, IconButton, PlusIcon } from "@saleor/macaw-ui";
import Image from "next/legacy/image";
import React, { useEffect, useRef } from "react";
import { useStyles } from "./styles";
import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import { messages } from "./messages";

interface FileInputProps {
  name: string;
  label: string;
  alt: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

const FileInput: React.FC<FileInputProps> = ({ name, label, alt, value, onChange, onBlur }) => {
  const classes = useStyles();
  const anchor = useRef<HTMLInputElement>(null);
  const [src, setSrc] = React.useState<string | undefined>(value);

  useEffect(() => {
    if (value !== src) {
      setSrc(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleFileUploadButtonClick = () => anchor.current!.click();

  const handleDragEvent = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onChange(event);
    const files = event.dataTransfer.files;
    setSrc(URL.createObjectURL(files[0]));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    onChange(event);
    const files = event.target.files;
    if (files) {
      setSrc(URL.createObjectURL(files[0]));
    }
  };

  const handleFileDelete = () => {
    anchor.current!.value = "";
    onChange({
      target: {
        name,
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>);
    setSrc(undefined);
  };

  return (
    <div
      className={classes.root}
      onDragOver={handleDragEvent}
      onDragEnter={handleDragEvent}
      onDragLeave={handleDragEvent}
      onDrop={handleFileDrop}
      onBlur={onBlur}
    >
      <Typography variant="body2" className={classes.label}>
        {label}
      </Typography>
      {!src && (
        <div className={classes.uploadField}>
          <>
            <Typography variant="body2" className={classes.uploadLabel}>
              <FormattedMessage {...messages.dragImage} />
            </Typography>
            <Typography
              variant="caption"
              className={clsx(classes.uploadLabel, classes.uploadSizeLabel)}
            >
              <FormattedMessage {...messages.maxFileSize} />
            </Typography>
            <Button
              variant="tertiary"
              className={classes.uploadButton}
              endIcon={<PlusIcon />}
              onClick={handleFileUploadButtonClick}
            >
              <FormattedMessage {...messages.uploadFile} />
            </Button>
          </>
        </div>
      )}
      {src && (
        <div className={classes.mediaContainer}>
          <Image
            className={classes.media}
            src={src}
            alt={alt}
            layout="fill"
            loader={({ src }) => src}
          />
          <div className={classes.mediaOverlay}>
            <div className={classes.mediaToolbar}>
              <IconButton
                color="primary"
                className={classes.mediaToolbarIcon}
                onClick={handleFileDelete}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        </div>
      )}
      <input
        name={name}
        className={classes.input}
        onChange={handleFileChange}
        type="file"
        ref={anchor}
        accept="image/*"
      />
    </div>
  );
};
export default FileInput;
