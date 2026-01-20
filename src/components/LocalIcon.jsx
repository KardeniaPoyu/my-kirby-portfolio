import React from 'react';
import { iconMap } from '../assets/icons/iconMap';

export default function LocalIcon({
  icon,
  size = 20,       // 默认大小
  className,
  style = {}       // 接收传进来的 style={{ fontSize: '28px' }}
}) {
  const iconSrc = iconMap[icon];
  
  // 处理 fontSize 兼容性：如果传了 fontSize，将其作为图标的宽高
  const finalSize = style.fontSize || `${size}px`;

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        width: finalSize,
        height: finalSize,
        backgroundColor: 'currentColor', // 关键：这会让图标颜色等于按钮的 color 属性
        WebkitMaskImage: `url(${iconSrc})`,
        maskImage: `url(${iconSrc})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style // 包含传入的 style，确保不破坏接口
      }}
    />
  );
}