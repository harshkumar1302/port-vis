const SIZES = {
  default: 'max-w-7xl',
  wide: 'max-w-[1400px]',
  narrow: 'max-w-6xl',
};

/**
 * Unified page width + horizontal padding for consistent responsive layout.
 */
const PageContainer = ({ children, className = '', size = 'wide', as: Tag = 'div' }) => (
  <Tag
    className={`page-container w-full mx-auto ${SIZES[size] ?? SIZES.wide} ${className}`}
  >
    {children}
  </Tag>
);

export default PageContainer;
