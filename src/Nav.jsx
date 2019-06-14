import React from 'react';
import { Link } from './routing/index.jsx'; // TODO: configure node-resolve

const getLinkText = path =>
  `${path[1].toUpperCase()}${path.slice(2)}`;

const Nav = ({ paths }) => (
  <nav>
    <ul>
      {paths.map((path, i) => (
        <li key={i}>
          <Link href={path}>
            {getLinkText(path)}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default Nav;
