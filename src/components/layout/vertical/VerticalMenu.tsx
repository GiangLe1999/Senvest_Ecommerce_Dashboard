// MUI Imports
import { useTheme } from "@mui/material/styles";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// Type Imports
import type { VerticalMenuContextProps } from "@menu/components/vertical-menu/Menu";

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from "@menu/vertical-menu";

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav";

// Styled Component Imports
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles";

type RenderExpandIconProps = {
  open?: boolean;
  transitionDuration?: VerticalMenuContextProps["transitionDuration"];
};

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void;
};

const RenderExpandIcon = ({
  open,
  transitionDuration,
}: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <i className="ri-arrow-right-s-line" />
  </StyledVerticalNavExpandIcon>
);

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();
  const { isBreakpointReached } = useVerticalNav();

  // Vars
  const { transitionDuration } = verticalNavOptions;

  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container) => scrollMenu(container, true),
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{ icon: <i className="ri-circle-fill" /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label="Admin Dashboard">
          <MenuItem
            href={`/dashboard`}
            icon={<i className="ri-dashboard-line" />}
            exactMatch={false}
            activeUrl="/dashboard"
          >
            Dashboard
          </MenuItem>

          <SubMenu
            label="Products"
            icon={<i className="ri-shopping-bag-3-line" />}
          >
            <MenuItem href={`/products/list`}>Product List</MenuItem>
            <MenuItem href={`/products/add`}>Add Product</MenuItem>
            <MenuItem href={`/products/category`}>Category List</MenuItem>
          </SubMenu>

          {/* <SubMenu label="Orders" icon={<i className="ri-refund-2-line" />}>
            <MenuItem href={`/orders/list`}>List</MenuItem>
            <MenuItem
              href={`/orders/details/5434`}
              exactMatch={false}
              activeUrl="/orders/details"
            >
              Details
            </MenuItem>
          </SubMenu> */}

          <MenuItem
            href={`/orders/list`}
            icon={<i className="ri-refund-2-line" />}
            exactMatch={false}
            activeUrl="/orders"
          >
            Orders
          </MenuItem>

          <SubMenu
            label="Customers"
            icon={<i className="ri-account-pin-circle-line" />}
          >
            <MenuItem href={`/customers/list`}>List</MenuItem>
            <MenuItem
              href={`/customers/details/879861`}
              exactMatch={false}
              activeUrl="/customers/details"
            >
              Details
            </MenuItem>
          </SubMenu>

          <MenuItem
            href={`/manage-reviews`}
            icon={<i className="ri-message-2-line" />}
            exactMatch={false}
            activeUrl="/manage-reviews"
          >
            Reviews
          </MenuItem>

          <MenuItem
            href={`/manage-banners`}
            icon={<i className="ri-file-image-line" />}
            exactMatch={false}
            activeUrl="/manage-banners"
          >
            Banners
          </MenuItem>

          <MenuItem
            href={`/manage-slogans`}
            icon={<i className="ri-slideshow-3-line" />}
            exactMatch={false}
            activeUrl="/manage-slogans"
          >
            Slogans
          </MenuItem>

          <MenuItem
            href={`/coupons`}
            icon={<i className="ri-coupon-3-line" />}
            exactMatch={false}
            activeUrl="/coupon"
          >
            Coupons
          </MenuItem>

          <MenuItem
            href={`/subscribers`}
            icon={<i className="ri-mail-add-line" />}
            exactMatch={false}
            activeUrl="/subscribers"
          >
            Subscribers
          </MenuItem>

          <MenuItem
            href={`/contacts`}
            icon={<i className="ri-contacts-book-3-line" />}
            exactMatch={false}
            activeUrl="/contacts"
          >
            Contacts
          </MenuItem>

          <MenuItem
            href={`/questions`}
            icon={<i className="ri-questionnaire-line" />}
            exactMatch={false}
            activeUrl="/questions"
          >
            Questions
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  );
};

export default VerticalMenu;
