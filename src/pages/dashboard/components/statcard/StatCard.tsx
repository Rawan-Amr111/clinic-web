import React from "react";
import classes from "./statCard.module.css";
import type { StatCardProps } from "../../../../domain/statCard";

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  unit,
  iconBgColor,
  iconColor,
}) => {
  return (
    <div className={classes.card}>
      <div
        className={classes.iconWrapper}
        style={{ backgroundColor: iconBgColor, color: iconColor }}
      >
        <Icon size={22} />
      </div>

      <div className={classes.content}>
        <p className={classes.cardTitle}>{title}</p>
        <div className={classes.valueWrapper}>
          <span className={classes.value}>{value}</span>
          {unit && <span className={classes.unit}>{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
