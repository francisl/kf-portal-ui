import React from 'react';
import { get, find } from 'lodash';
import { ROLES } from 'common/constants';

import { css } from 'emotion';

const roleLookup = ROLES.reduce((acc, { type, ...x }) => ({ ...acc, [type]: x }), {});

const RoleIconButton = ({ className = '', children, style = {}, roleType }) => {
  const userRoleDisplayName = find(ROLES, { type: roleType }).displayName;
  const RoleIcon = get(roleLookup, [roleType, 'icon'], null);
  const background = get(roleLookup, [roleType, 'color'], null);

  return (
    <div
      style={style}
      css={`
        display: flex;
        height: 42px;
        border-radius: 21px;
        background-color: ${background};
        color: white;
        font-size: 14px;
        font-weight: 300;
        line-height: 1.86;
        letter-spacing: 0.2px;
        text-align: left;
        text-transform: capitalize;
        padding: 0 16px 0 0;
        ${className};
      `}
    >
      <RoleIcon
        height="45px"
        fill="#fff"
        css={css`
          margin-right: 11px;
          flex: none;
        `}
      />
      <div
        css={`
          justify-content: space-between;
          display: flex;
          align-items: center;
        `}
      >
        <div
          css={`
            font-weight: 500;
          `}
        >
          {userRoleDisplayName}
        </div>
        {children}
      </div>
    </div>
  );
};

export default RoleIconButton;
