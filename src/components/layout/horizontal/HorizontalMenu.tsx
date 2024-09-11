// MUI Imports
import { useTheme } from "@mui/material/styles";

// Type Imports
import type { VerticalMenuContextProps } from "@menu/components/vertical-menu/Menu";

// Component Imports
import HorizontalNav, { Menu, SubMenu, MenuItem } from "@menu/horizontal-menu";
import VerticalNavContent from "./VerticalNavContent";

// import { GenerateHorizontalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav";
import { useSettings } from "@core/hooks/useSettings";

// Styled Component Imports
import StyledHorizontalNavExpandIcon from "@menu/styles/horizontal/StyledHorizontalNavExpandIcon";
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "@core/styles/horizontal/menuItemStyles";
import menuRootStyles from "@core/styles/horizontal/menuRootStyles";
import verticalMenuItemStyles from "@core/styles/vertical/menuItemStyles";
import verticalNavigationCustomStyles from "@core/styles/vertical/navigationCustomStyles";

type RenderExpandIconProps = {
  level?: number;
};

type RenderVerticalExpandIconProps = {
  open?: boolean;
  transitionDuration?: VerticalMenuContextProps["transitionDuration"];
};

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className="ri-arrow-right-s-line" />
  </StyledHorizontalNavExpandIcon>
);

const RenderVerticalExpandIcon = ({
  open,
  transitionDuration,
}: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <i className="ri-arrow-right-s-line" />
  </StyledVerticalNavExpandIcon>
);

const HorizontalMenu = () => {
  // Hooks
  const verticalNavOptions = useVerticalNav();
  const theme = useTheme();
  const { settings } = useSettings();

  // Vars
  const { skin } = settings;
  const { transitionDuration } = verticalNavOptions;

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === "bordered"
            ? "var(--mui-palette-background-paper)"
            : "var(--mui-palette-background-default)",
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        renderExpandedMenuItemIcon={{ icon: <i className="ri-circle-fill" /> }}
        menuItemStyles={menuItemStyles(theme, "ri-circle-fill")}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 4 : 14),
          alignmentAxis: 0,
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon
              open={open}
              transitionDuration={transitionDuration}
            />
          ),
          renderExpandedMenuItemIcon: {
            icon: <i className="ri-circle-fill" />,
          },
        }}
      >
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
          <MenuItem href={`/products/list`}>List</MenuItem>
          <MenuItem href={`/products/add`}>Add</MenuItem>
          <MenuItem href={`/products/category`}>Category</MenuItem>
        </SubMenu>

        <MenuItem
         href={`/orders/list`}
          icon={<i className="ri-refund-2-line" />}
          exactMatch={false}
          activeUrl="/orders"
        >
          Orders
        </MenuItem>

        {/* <SubMenu label="Orders" icon={<i className="ri-secure-payment-fill" />}>
          <MenuItem href={`/orders/list`}>List</MenuItem>
          <MenuItem
            href={`/orders/details/5434`}
            exactMatch={false}
            activeUrl="/orders/details"
          >
            Details
          </MenuItem>
        </SubMenu> */}

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
          icon={<i className="ri-file-word-line" />}
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
      </Menu>
    </HorizontalNav>
  );
};

export default HorizontalMenu;
