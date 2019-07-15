import * as React from 'react';
import { Link } from './routing';

interface NavProps {
  paths: string[];
}

const getLinkText = (path: string) =>
  `${path[1].toUpperCase()}${path.slice(2)}`;

const Nav: React.FC<NavProps> = ({ paths }) => (
  <nav>
    <ul>
      {paths.map(path => (
        <li key={path}>
          <Link href={path}>{getLinkText(path)}</Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default Nav;
