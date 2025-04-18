// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#FFD60A',
    colorInfo: '#FFD60A',
    colorSuccess: '#3CCF4E',
    colorWarning: '#FFBE0B',
    colorError: '#FF5A5A',
    colorTextBase: '#F1F2FF',
    colorBgBase: '#000814',
    fontFamily: 'Inter, sans-serif',
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Button: {
      colorPrimary: '#FFD60A',
      colorPrimaryHover: '#E6C108',
      colorPrimaryActive: '#E6C108',
      defaultColor: '#F1F2FF',
      defaultBg: '#2C333F',
      defaultBorderColor: '#2C333F',
    },
    Menu: {
      darkItemColor: '#F1F2FF',
      darkItemHoverColor: '#FFD60A',
      darkItemSelectedColor: '#FFD60A',
      darkItemSelectedBg: '#161D29',
    },
    Input: {
      colorBgContainer: '#2C333F',
      colorBorder: '#2C333F',
      colorPrimaryHover: '#FFD60A',
      colorTextPlaceholder: '#838894',
    },
    Select: {
      colorBgContainer: '#2C333F',
      colorBorder: '#2C333F',
      colorPrimaryHover: '#FFD60A',
      colorTextPlaceholder: '#838894',
    },
    Dropdown: {
      colorBgElevated: '#161D29',
      controlItemBgHover: '#2C333F',
    },
    Drawer: {
      colorBgElevated: '#000814',
      colorText: '#F1F2FF',
    },
  },
};

export default theme;
