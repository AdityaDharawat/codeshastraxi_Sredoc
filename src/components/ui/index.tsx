import React from 'react';

// Card Component
export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white shadow rounded-lg p-4">{children}</div>
);

// LineChart Component (Mock Implementation)
export const LineChart: React.FC<{
  height: number;
}> = ({ height }) => (
  <div style={{ height }} className="bg-gray-100 flex items-center justify-center">
    <p>LineChart Placeholder</p>
  </div>
);

// BarChart Component (Mock Implementation)
export const BarChart: React.FC<{
  data: { [key: string]: string | number }[];
  xField: string;
  yField: string;
  color: string;
  height: number;
}> = ({ data, yField, color, height }) => (
  <div style={{ height }} className="bg-gray-100 flex items-center justify-center">
    <p>BarChart Placeholder</p>
    <pre className="text-xs text-gray-500">{JSON.stringify(data, null, 2)}</pre>
  </div>
);

// PieChart Component (Mock Implementation)
export const PieChart: React.FC<{
  data: { name: string; value: number }[];
  colors: string[];
  height: number;
}> = ({ data, colors, height }) => (
  <div style={{ height }} className="bg-gray-100 flex items-center justify-center">
    <p>PieChart Placeholder</p>
  </div>
);

// Table Component
export const Table: React.FC<{
  columns: { key: string; header: string; render?: (value: any) => React.ReactNode }[];
  data: any[];
}> = ({ columns, data }) => (
  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.key} className="px-4 py-2 text-left text-sm font-medium text-gray-600">
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx} className="border-t">
          {columns.map((col) => (
            <td key={col.key} className="px-4 py-2 text-sm text-gray-800">
              {col.render ? col.render(row[col.key]) : row[col.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// Dropdown Component
export const Dropdown: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}> = ({ options, value, onChange, icon }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {icon && <div className="absolute left-2 top-2.5">{icon}</div>}
  </div>
);

// Button Component
export const Button: React.FC<{
  variant?: 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ variant = 'outline', size = 'md', onClick, icon, children }) => {
  const baseClasses = 'rounded-lg font-medium focus:outline-none';
  const sizeClasses =
    size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2';
  const variantClasses =
    variant === 'outline'
      ? 'border border-gray-300 text-gray-800 bg-white hover:bg-gray-100'
      : 'text-gray-800 bg-transparent hover:bg-gray-100';

  return (
    <button onClick={onClick} className={`${baseClasses} ${sizeClasses} ${variantClasses} flex items-center`}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
